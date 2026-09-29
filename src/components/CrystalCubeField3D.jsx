import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, useFBO } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { Effect, EffectAttribute, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { COINS, DECAL_CODE, DECAL_ARROW, ATLAS_SLOTS, makeDecalAtlas, makeCoinFace } from "./coinLogos.js";

/* ── feature flags ─────────────────────────────────────────── */
const SHOW_CONTENT = false; // coins inside + printed logos/code/arrows (true → show them)
const USE_BLOOM = true; // neon bloom post-process (false → turn it off entirely)
const BUFFER_SCALE = 0.5; // see-through buffer resolution vs. canvas (lower = faster, softer)
const CORNER_BLUR_PX = 5.5; // max screen blur (px) at each cube's far top corner (0 = off)

/* ── grid config ───────────────────────────────────────────── */
const COLS = 22;
const ROWS = 22;
const SIZE = 1; // block width/depth
const HEIGHT = 1; // cube, like the reference image
const GAP = 0.18;
const PITCH = SIZE + GAP;
const LIFT = 0.3; // hovered block rise
const BG = "#0b0c11";
const FOG_NEAR = 7;
const FOG_FAR = 18;

const COUNT = COLS * ROWS;
const HALF_W = ((COLS - 1) * PITCH) / 2;
const HALF_D = ((ROWS - 1) * PITCH) / 2;

/* ── helpers ───────────────────────────────────────────────── */
const ease = (v) => v * v * (3 - 2 * v); // ease-in-out on 0..1
function smoothstep(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

// seeded random so layout/patterns are stable between renders
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Floor: navy base, soft contact shadows under every block,
   triple-line circuit traces with 45° jogs running through the gaps, and small glowing dots */
function makeFloorTexture() {
  const px = 4096;
  const worldW = COLS * PITCH;
  const worldD = ROWS * PITCH;
  const sx = px / worldW;
  const sz = px / worldD;
  const rand = mulberry32(11);

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#101118";
  ctx.fillRect(0, 0, px, px);

  // contact shadows: draw on a small canvas with blur, then upscale (cheap soft shadows)
  const sp = 512;
  const sc = document.createElement("canvas");
  sc.width = sc.height = sp;
  const sctx = sc.getContext("2d");
  sctx.filter = "blur(4px)";
  sctx.fillStyle = "rgba(2,2,5,0.8)";
  const ssx = sp / worldW;
  const ssz = sp / worldD;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = (c + 0.5) * PITCH;
      const cz = (r + 0.5) * PITCH;
      const s = SIZE * 1.12;
      sctx.fillRect((cx - s / 2) * ssx, (cz - s / 2) * ssz, s * ssx, s * ssz);
    }
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(sc, 0, 0, px, px);

  const gapX = (i) => i * PITCH * sx;
  const gapZ = (j) => j * PITCH * sz;
  const cellX = PITCH * sx;
  const cellZ = PITCH * sz;
  const spacing = 9; // px between the parallel wires
  const jog = 16; // lateral 45° jog inside a gap

  const strokeBundle = (pts, count, alpha) => {
    for (let k = 0; k < count; k++) {
      const off = (k - (count - 1) / 2) * spacing;
      ctx.beginPath();
      pts.forEach(([x, y, nx, ny], idx) => {
        const X = x + nx * off;
        const Y = y + ny * off;
        if (idx === 0) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);
      });
      ctx.strokeStyle = `rgba(150,158,200,${alpha * 0.45})`;
      ctx.lineWidth = 2.2;
      ctx.lineJoin = "round";
      ctx.stroke();
    }
  };

  // runs along vertical gaps (constant x), with a small 45° jog midway
  for (let n = 0; n < 22; n++) {
    const i = 1 + Math.floor(rand() * (COLS - 1));
    const j0 = Math.floor(rand() * (ROWS - 2));
    const len = 1 + Math.floor(rand() * 3);
    const x = gapX(i);
    const y0 = gapZ(j0) + cellZ * 0.3;
    const y1 = y0 + len * cellZ;
    const ym = (y0 + y1) / 2;
    const d = rand() > 0.5 ? jog : -jog;
    strokeBundle(
      [
        [x, y0, 1, 0],
        [x, ym - jog / 2, 1, 0],
        [x + d, ym + jog / 2, 1, 0],
        [x + d, y1, 1, 0],
      ],
      3,
      0.4 + rand() * 0.2,
    );
  }
  // runs along horizontal gaps (constant z)
  for (let n = 0; n < 22; n++) {
    const j = 1 + Math.floor(rand() * (ROWS - 1));
    const i0 = Math.floor(rand() * (COLS - 2));
    const len = 1 + Math.floor(rand() * 3);
    const y = gapZ(j);
    const x0 = gapX(i0) + cellX * 0.3;
    const x1 = x0 + len * cellX;
    const xm = (x0 + x1) / 2;
    const d = rand() > 0.5 ? jog : -jog;
    strokeBundle(
      [
        [x0, y, 0, 1],
        [xm - jog / 2, y, 0, 1],
        [xm + jog / 2, y + d, 0, 1],
        [x1, y + d, 0, 1],
      ],
      3,
      0.4 + rand() * 0.2,
    );
  }

  // tiny dots with a faint ring, scattered at gap intersections
  for (let n = 0; n < 260; n++) {
    const x = gapX(Math.floor(rand() * (COLS + 1))) + (rand() - 0.5) * GAP * sx * 0.7;
    const y = gapZ(Math.floor(rand() * (ROWS + 1))) + (rand() - 0.5) * GAP * sz * 0.7;
    ctx.fillStyle = "rgba(110,120,180,0.06)";
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(140,155,230,${0.25 + rand() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Every block gets its own look (reference: 큐브스타일.png):
   - coin: a coloured coin floating inside the glass (seen blurred through it)
   - decal: white mark printed on one visible face (coin logo, code text or arrow)
   - pattern: faint etched grid / dots                                           */
function buildBlockContent() {
  const rand = mulberry32(21);
  const coin = new Int8Array(COUNT).fill(-1);
  const decal = new Float32Array(COUNT).fill(-1);
  const decalFace = new Float32Array(COUNT);
  const pattern = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = rand();
    const face = rand() < 0.45 ? 0 : rand() < 0.75 ? 1 : 2; // left side / right side / top
    if (r < 0.26) {
      coin[i] = (rand() * COINS.length) | 0;
      if (rand() < 0.35) {
        decal[i] = DECAL_CODE;
        decalFace[i] = face === 2 ? 1 : face;
      }
    } else if (r < 0.46) {
      decal[i] = (rand() * COINS.length) | 0;
      decalFace[i] = face;
    } else if (r < 0.54) {
      decal[i] = DECAL_CODE;
      decalFace[i] = face === 2 ? 0 : face;
    } else if (r < 0.58) {
      decal[i] = DECAL_ARROW;
      decalFace[i] = face;
    }
    // grid / dot patterns removed (pattern stays 0); consume the draw so the layout stays the same
    rand();
  }
  if (!SHOW_CONTENT) {
    coin.fill(-1);
    decal.fill(-1);
  }
  return { coin, decal, decalFace, pattern };
}

/* ── glow map: one texel per block, sampled (blurred) by the floor for light spill ── */
function useGlowMap() {
  return useMemo(() => {
    const tex = new THREE.DataTexture(new Uint8Array(COUNT * 4), COLS, ROWS, THREE.RGBAFormat);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/* ── glass shaders (reference: 큐브스타일.png / 3d인터랙티브참고.jpg) ──────────────
   Each fragment on a cube's front face traces the view ray through the box analytically:
   - L = path length inside the cube → Beer-Lambert absorption: thin edges stay light,
     thick centre goes deep (the "jelly" look of acrylic)
   - exit point on the far faces → the opposite inner edges + bottom dots show through
   - background comes from a pre-pass buffer (floor, coins, and every cube's back faces
     multiplied in), blurred for frost → cubes overlapping each other get deeper
   - reflections of an analytic studio (overhead softbox + strip lights) weighted by
     Fresnel, so each face catches light differently                                    */
const glassVertex = /* glsl */ `
  attribute float aGlow;
  attribute float aPattern;
  attribute float aDecal;
  attribute float aDecalFace;
  attribute float aInner;
  varying float vGlow;
  varying float vPattern;
  varying float vDecal;
  varying float vDecalFace;
  varying float vInner;
  varying vec3 vObjPos;
  varying vec3 vObjNormal;
  varying vec3 vCamObj;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;
  varying float vDepth;
  void main() {
    vGlow = aGlow;
    vPattern = aPattern;
    vDecal = aDecal;
    vDecalFace = aDecalFace;
    vInner = aInner;
    vObjPos = position;
    vObjNormal = normal;
    mat4 m = modelMatrix * instanceMatrix;
    vec4 wp = m * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(m) * normal);
    vViewNormal = normalize(mat3(viewMatrix) * vWorldNormal);
    vCamObj = (inverse(m) * vec4(cameraPosition, 1.0)).xyz;
    vec4 mv = viewMatrix * wp;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const glassFragment = /* glsl */ `
  uniform sampler2D uBuffer;
  uniform vec2 uViewport;
  uniform vec3 uFog;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uHeight;
  uniform sampler2D uAtlas;
  uniform float uSlots;
  uniform mat3 uObjToWorld;
  varying float vGlow;
  varying float vPattern;
  varying float vDecal;
  varying float vDecalFace;
  varying float vInner;
  varying vec3 vObjPos;
  varying vec3 vObjNormal;
  varying vec3 vCamObj;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewNormal;
  varying float vDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // analytic studio: overhead softbox, two vertical strip lights, faint horizon
  float studio(vec3 r) {
    float az = atan(r.z, r.x);
    float top = smoothstep(0.25, 0.95, r.y) * 1.25;
    float stripA = exp(-pow((az - 2.35) * 4.0, 2.0)) * smoothstep(-0.7, 0.4, r.y) * 0.9;
    float stripB = exp(-pow((az - 0.55) * 5.0, 2.0)) * smoothstep(-0.6, 0.3, r.y) * 0.45;
    float hor = exp(-pow((r.y + 0.05) * 3.5, 2.0)) * 0.22;
    return top + stripA + stripB + hor;
  }

  // second-largest of three
  float mid3(vec3 a) {
    float mx = max(a.x, max(a.y, a.z));
    float mn = min(a.x, min(a.y, a.z));
    return a.x + a.y + a.z - mx - mn;
  }

  vec3 sampleBlur(vec2 uv, float r) {
    vec3 acc = vec3(0.0);
    const float GA = 2.39996323;
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float rad = sqrt((fi + 0.5) / 16.0) * r;
      vec2 o = vec2(cos(fi * GA), sin(fi * GA)) * rad;
      acc += texture2D(uBuffer, uv + o * vec2(uViewport.y / uViewport.x, 1.0)).rgb;
    }
    return acc / 16.0;
  }

  void main() {
    vec3 H = vec3(0.5, uHeight * 0.5, 0.5);
    vec3 p = vObjPos;
    vec3 d = normalize(p - vCamObj);
    vec3 sd = vec3(d.x >= 0.0 ? 1.0 : -1.0, d.y >= 0.0 ? 1.0 : -1.0, d.z >= 0.0 ? 1.0 : -1.0);
    vec3 dd = sd * max(abs(d), vec3(1e-4));
    vec3 tv = (sd * H - p) / dd;
    float L = max(min(tv.x, min(tv.y, tv.z)), 0.0);
    vec3 q = p + d * L;                 // exit point on the far side
    // light spreads out from the front top corner (the vertex nearest the camera): each fragment
    // lights once a very soft glow front, growing with vGlow, reaches it
    vec2 toCam = normalize(vCamObj.xz + vec2(1e-5));
    vec3 lightOrigin = vec3(sign(toCam.x) * 0.5, H.y, sign(toCam.y) * 0.5);
    float dn = clamp(length(p - lightOrigin) / 1.5, 0.0, 1.0); // 0 = at that corner, 1 = far bottom
    const float SPREAD_SOFT = 1.6; // very soft front: reads as a glow swelling out, not a ring
    float front = vGlow * (1.0 + SPREAD_SOFT);
    float g = smoothstep(0.0, 1.0, 1.0 - smoothstep(front - SPREAD_SOFT, front, dn));

    // depth of field inside one cube: blur ramps up toward the top corner farthest from the viewer
    vec2 away = normalize(-vCamObj.xz + vec2(1e-5));
    vec3 farCorner = vec3(sign(away.x) * 0.5, H.y, sign(away.y) * 0.5);
    // confined to the region around that corner; the rest of the cube stays sharp
    float bf = 1.0 - smoothstep(0.0, 0.85, length(p - farCorner));   // front surface
    float bq = 1.0 - smoothstep(0.0, 0.85, length(q - farCorner));   // far side seen through
    bf = sqrt(bf);
    bq = sqrt(bq);

    // ── view / reflection ──
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vWorldPos - cameraPosition);
    vec3 R = reflect(V, N);
    float cosT = clamp(dot(N, -V), 0.0, 1.0);
    float F = mix(0.06, 1.0, pow(1.0 - cosT, 3.0));
    float env = studio(R);

    // ── background through the glass (refracted + frosted) ──
    vec2 uv = gl_FragCoord.xy / uViewport;
    uv -= vViewNormal.xy * (0.006 + 0.01 * L);
    // frost only — the corner depth-of-field is done by the post blur; widening this pulled
    // a neighbour's glow far across other blocks
    vec3 bg = sampleBlur(uv, 0.006 + 0.006 * L);

    // ── volume ──
    // idle: smoked, slightly cool acrylic
    vec3 sigI = vec3(0.5, 0.46, 0.36);
    vec3 idle = bg * exp(-sigI * L);
    float fromTop = clamp((p.y + q.y) / (4.0 * H.y) + 0.5, 0.0, 1.0);
    idle += vec3(0.012, 0.014, 0.023) * (1.0 - exp(-1.8 * L)) * mix(0.55, 1.35, fromTop);
    // lit: blue acrylic lit from within — thin paths pale, thick paths deep blue
    vec3 sigL = vec3(5.5, 2.8, 0.45);
    vec3 lightIn = vec3(0.42, 0.62, 1.0);
    vec3 lit = (lightIn * 0.72 + bg * 0.4) * exp(-sigL * L);
    lit += vec3(0.008, 0.07, 0.62) * (1.0 - exp(-1.6 * L));
    // a block holding a coin glows softer so the coin reads through
    lit = mix(lit, bg * vec3(0.35, 0.6, 1.3) + vec3(0.0, 0.03, 0.2), vInner * 0.5);
    vec3 col = mix(idle, lit, g);

    // ── what shows through on the far faces ──
    vec3 aq = abs(q) / H;
    float innerE = mid3(aq);
    // idle blocks: original far-edge line (untouched)
    float innerLineI = smoothstep(mix(0.93, 0.6, bq), 0.995, innerE) * 0.5
                     + smoothstep(mix(0.978, 0.9, bq), 0.998, innerE) * 0.5 * (1.0 - bq);
    innerLineI *= mix(1.0, 0.25, bq);
    vec3 inNI = normalize(uObjToWorld * (step(0.95, aq) * sign(q)));
    float inLightI = 0.15 + 0.85 * pow(max(dot(inNI, normalize(vec3(-0.35, 1.0, 0.25))), 0.0), 1.5);
    vec3 innerIdle = vec3(0.028, 0.031, 0.042) * innerLineI * inLightI * exp(-0.9 * L);
    // lit (blue) blocks: frosted only — soft exponential falloff with no crisp core,
    // wider and fainter toward the far corner
    float innerD = max(1.0 - innerE, 0.0);
    float innerLine = exp(-innerD / mix(0.22, 0.4, bq)) * 0.95;
    innerLine *= mix(1.0, 0.25, bq);
    // light direction: this face plus only the nearer edge (both at once clumps at the vertices)
    float aqMax = max(aq.x, max(aq.y, aq.z));
    vec3 faceQ = step(vec3(aqMax - 1e-4), aq);
    vec3 selQ = (1.0 - faceQ) * exp((aq - innerE) * 30.0);
    vec3 edgeQ = selQ / max(dot(selQ, vec3(1.0)), 1e-4) * smoothstep(0.85, 1.0, aq);
    vec3 inN = normalize(uObjToWorld * ((faceQ + edgeQ) * sign(q)));
    float inLight = 0.55 + 0.45 * pow(max(dot(inN, normalize(vec3(-0.35, 1.0, 0.25))), 0.0), 1.5);
    // muted navy, darker than the lit body: blended in rather than added — adding pushed the
    // blue past 1.0 and the tone mapping / bloom washed it out to white
    float innerAmt = clamp(innerLine * inLight * exp(-0.5 * L), 0.0, 1.0);
    col += innerIdle * (1.0 - g);
    col = mix(col, vec3(0.006, 0.05, 0.28), innerAmt * 0.85 * g);
    bool exitBottom = q.y < -H.y + 0.002;
    if (exitBottom && vPattern > 1.5) {
      vec2 f = fract((q.xz + 0.5) * 13.0) - 0.5;
      float dotm = 1.0 - smoothstep(0.05, 0.12, length(f));
      col += mix(vec3(0.05, 0.06, 0.08), vec3(0.7, 0.85, 1.0), g) * dotm * 0.8;
    }
    if (vPattern > 0.5 && vPattern < 1.5) {
      // faint grid etched on the far faces
      vec3 gq = (q + H) * 10.0;
      vec3 w = fwidth(gq) + 1e-4;
      vec3 gl3 = 1.0 - min(abs(fract(gq - 0.5) - 0.5) / w, 1.0);
      float grid = max(max(gl3.x * step(aq.x, 0.99), gl3.y * step(aq.y, 0.99)), gl3.z * step(aq.z, 0.99));
      col += mix(vec3(0.02, 0.024, 0.035), vec3(0.25, 0.35, 0.6), g) * grid;
    }

    // ── surface ──
    // reflections: overhead softbox / strips, stronger at grazing angles
    vec3 envCol = mix(vec3(0.86, 0.89, 1.0), vec3(0.8, 0.9, 1.0), g);
    env = mix(env, env * 0.25 + 0.1, bf); // soft, defocused reflections at the far corner
    col += envCol * env * F * mix(0.2, 0.8, g);
    // hairline front edges catching light — brightness varies with what they reflect
    vec3 ap = abs(p) / H;
    float fe = mid3(ap);
    float few = fwidth(fe) * 1.2;
    // lit (blue) blocks: thin core + soft exponential halo, so the line fades out instead of a hard band
    float edgeD = max(1.0 - fe, 0.0);
    float frontCore = smoothstep(1.0 - few - mix(0.012, 0.2, bf), 1.0 - 0.002, fe);
    float frontHalo = exp(-edgeD / mix(0.055, 0.15, bf));
    float frontLine = (frontCore * 0.75 + frontHalo * 0.4) * mix(1.0, 0.18, bf);
    // bevel normal blends smoothly toward the edge (a step here made the edge light jump → "tape" band).
    // Each edge gets its own bevel normal and we cross-fade to the nearer edge: summing both edges'
    // normals at a vertex tilted it diagonally into the softbox and the glows clumped there.
    vec3 sp = sign(p);
    float apMax = max(ap.x, max(ap.y, ap.z));
    vec3 faceM = step(vec3(apMax - 1e-4), ap);          // the face this fragment is on
    vec3 other = 1.0 - faceM;                            // its two edge directions
    vec3 faceN = faceM * sp * 1.35;
    vec3 w = smoothstep(0.8, 1.0, ap) * other;
    float envX = studio(reflect(V, normalize(uObjToWorld * (faceN + vec3(sp.x * w.x, 0.0, 0.0)))));
    float envY = studio(reflect(V, normalize(uObjToWorld * (faceN + vec3(0.0, sp.y * w.y, 0.0)))));
    float envZ = studio(reflect(V, normalize(uObjToWorld * (faceN + vec3(0.0, 0.0, sp.z * w.z)))));
    vec3 sel = other * exp((ap - fe) * 30.0);           // soft pick of the nearer edge
    float edgeEnv = dot(sel, vec3(envX, envY, envZ)) / max(dot(sel, vec3(1.0)), 1e-4);
    float edgeLight = 0.06 + pow(clamp(edgeEnv, 0.0, 1.4), 1.6);
    // the near vertical edge (front middle) reflects only the dim horizon, so it gets its own
    // light: bright at the top, fading toward the bottom
    float selSum = max(dot(sel, vec3(1.0)), 1e-4);
    float vertW = (sel.x + sel.z) / selSum * (1.0 - faceM.y);
    float nearV = smoothstep(0.6, 0.95, dot(normalize(sp.xz), -away));
    float heightT = clamp(p.y / H.y * 0.5 + 0.5, 0.0, 1.0);
    // wide, soft band (own falloff, not the hairline) with a strong top→bottom fade
    float vertBand = exp(-edgeD / 0.14);
    // fainter soft band + a crisp hairline core so the edge itself stays sharp
    float vertLight = vertW * nearV * pow(heightT, 2.6) * (vertBand * 0.26 + frontCore * 0.4);
    // top edge of the left/right side faces: a faint white gradient instead of the navy-ish sheen
    // (much softer than the top face's own edge highlight)
    float sideTopW = sel.y / selSum * (1.0 - faceM.y) * step(0.0, p.y);
    float sideTop = sideTopW * exp(-edgeD / 0.2) * 0.22 * mix(1.0, 0.3, bf);
    // top face, its two front edges: an extra wide soft band so their glow spreads further
    vec2 nearXZ = vec2(
      dot(vec2(sp.x, 0.0), -away),
      dot(vec2(0.0, sp.z), -away));
    float topFrontW = faceM.y * (sel.x * smoothstep(0.2, 0.6, nearXZ.x) + sel.z * smoothstep(0.2, 0.6, nearXZ.y)) / selSum;
    float topFront = topFrontW * exp(-edgeD / 0.16) * 0.25 * mix(1.0, 0.3, bf);
    vec3 frontLit = vec3(0.65, 0.82, 1.0) * frontLine * edgeLight
                  + vec3(0.65, 0.82, 1.0) * topFront * edgeLight
                  + vec3(0.6, 0.76, 1.0) * vertLight
                  + vec3(0.26, 0.38, 0.54) * sideTop
                  + vec3(0.03, 0.16, 0.42) * smoothstep(mix(0.76, 0.5, bf), 1.0, fe) * edgeLight * mix(1.0, 0.5, bf) * (1.0 - sideTopW);
    // idle: the near vertical (centre) edge read too sharp against the rest — tone it down
    float idleVertDim = 1.0 - vertW * nearV * 0.5;
    // idle: same smooth bevel / nearer-edge light as lit (no step → no "tape" band), in the
    // original dim grey; halo kept fainter than on lit blocks
    float frontHaloI = exp(-edgeD / mix(0.11, 0.2, bf)); // wider gradient than lit
    float frontLineI = (frontCore * 0.75 + frontHaloI * 0.2) * mix(1.0, 0.18, bf);
    vec3 frontIdle = vec3(0.12, 0.13, 0.16) * frontLineI * edgeLight
                   + vec3(0.014, 0.015, 0.02) * smoothstep(mix(0.72, 0.5, bf), 1.0, fe) * edgeLight * mix(1.0, 0.5, bf) * 0.75;
    // near vertical edge: like lit, bright at the top fading down (soft band + crisp core), in idle grey
    vec3 idleVert = vec3(0.12, 0.13, 0.16) * vertW * nearV * pow(heightT, 2.6) * (vertBand * 0.26 + frontCore * 0.4);
    col += mix(frontIdle * idleVertDim + idleVert, frontLit, g);

    // defocus: flatten detail toward the cube's average body colour near the far corner
    vec3 avgBody = mix(vec3(0.012, 0.014, 0.022) + bg * 0.45, vec3(0.03, 0.16, 0.7) + bg * 0.1, g);
    col = mix(col, avgBody, bf * 0.3);

    // printed white marks (logo / code / arrow) on one visible face
    if (vDecal > -0.5) {
      float faceId = vObjNormal.y > 0.5 ? 2.0 : (vObjNormal.x < -0.5 ? 0.0 : (vObjNormal.z > 0.5 ? 1.0 : -1.0));
      if (abs(faceId - vDecalFace) < 0.5) {
        vec2 duv;
        if (faceId < 0.5) duv = vec2(p.z + 0.5, p.y / uHeight + 0.5);
        else if (faceId < 1.5) duv = vec2(p.x + 0.5, p.y / uHeight + 0.5);
        else duv = vec2(p.x + p.z, p.x - p.z) * 0.7071 + 0.5;
        float slot = floor(vDecal + 0.5);
        float cx = mod(slot, uSlots);
        float cy = floor(slot / uSlots + 0.001);
        float a = texture2D(uAtlas, vec2((cx + duv.x) / uSlots, (cy + 1.0 - duv.y) / uSlots)).a;
        col = mix(col, vec3(mix(0.55, 1.1, g)), a * 0.9);
      }
    }

    // frosted grain
    col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

    float fogF = smoothstep(uFogNear, uFogFar, vDepth);
    col = mix(col, uFog, fogF);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/* Pre-pass only: the cubes' far faces multiply what's behind them, so overlaps darken/tint */
const backVertex = /* glsl */ `
  attribute float aGlow;
  varying float vGlow;
  void main() {
    vGlow = aGlow;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;
const backFragment = /* glsl */ `
  varying float vGlow;
  void main() {
    vec3 tint = mix(vec3(0.72, 0.75, 0.84), vec3(0.22, 0.45, 1.0), smoothstep(0.0, 1.0, vGlow));
    gl_FragColor = vec4(tint, 1.0);
  }
`;

/* Depth-of-field mask: per pixel, how close we are to the cube's far top corner.
   A shader can't soften a cube's silhouette from inside, so the actual blur is a
   post effect (CornerBlurEffect) driven by this mask.                            */
const maskVertex = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vCamObj;
  void main() {
    vObjPos = position;
    mat4 m = modelMatrix * instanceMatrix;
    vCamObj = (inverse(m) * vec4(cameraPosition, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * m * vec4(position, 1.0);
  }
`;
const maskFragment = /* glsl */ `
  uniform float uHeight;
  varying vec3 vObjPos;
  varying vec3 vCamObj;
  void main() {
    vec2 away = normalize(-vCamObj.xz + vec2(1e-5));
    vec3 farCorner = vec3(sign(away.x) * 0.5, uHeight * 0.5, sign(away.y) * 0.5);
    // wider falloff from the corner, staying inside the block
    float b = 1.0 - smoothstep(0.0, 1.3, length(vObjPos - farCorner));
    gl_FragColor = vec4(pow(b, 1.4), 0.0, 0.0, 1.0);
  }
`;

const cornerBlurFragment = /* glsl */ `
  uniform sampler2D uMask;
  uniform float uMaxRadius;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // dilate the mask a little so the silhouette just outside the far corner softens too
    float m = texture2D(uMask, uv).r;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7853982;
      m = max(m, texture2D(uMask, uv + vec2(cos(a), sin(a)) * texelSize * uMaxRadius).r * 0.45);
    }
    if (m < 0.02) { outputColor = inputColor; return; }
    float r = m * uMaxRadius;
    vec4 acc = inputColor;
    for (int i = 0; i < 16; i++) {
      float fi = float(i);
      float rad = sqrt((fi + 0.5) / 16.0) * r;
      vec2 o = vec2(cos(fi * 2.3999632), sin(fi * 2.3999632)) * rad * texelSize;
      acc += texture2D(inputBuffer, uv + o);
    }
    outputColor = acc / 17.0;
  }
`;

class CornerBlurEffect extends Effect {
  constructor(mask) {
    super("CornerBlurEffect", cornerBlurFragment, {
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map([
        ["uMask", new THREE.Uniform(mask)],
        ["uMaxRadius", new THREE.Uniform(CORNER_BLUR_PX)],
      ]),
    });
  }
}

function useGlassMaterials(atlas) {
  return useMemo(() => {
    const front = new THREE.ShaderMaterial({
      vertexShader: glassVertex,
      fragmentShader: glassFragment,
      uniforms: {
        uBuffer: { value: null },
        uViewport: { value: new THREE.Vector2(1, 1) },
        uFog: { value: new THREE.Color(BG) },
        uFogNear: { value: FOG_NEAR },
        uFogFar: { value: FOG_FAR },
        uHeight: { value: HEIGHT },
        uAtlas: { value: atlas },
        uSlots: { value: ATLAS_SLOTS },
        // blocks sit in a group rotated 45° around Y
        uObjToWorld: { value: new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 4)) },
      },
    });
    const back = new THREE.ShaderMaterial({
      vertexShader: backVertex,
      fragmentShader: backFragment,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.DstColorFactor,
      blendDst: THREE.ZeroFactor,
    });
    const mask = new THREE.ShaderMaterial({
      vertexShader: maskVertex,
      fragmentShader: maskFragment,
      uniforms: { uHeight: { value: HEIGHT } },
      toneMapped: false,
    });
    return { front, back, mask };
  }, [atlas]);
}

/* ── scene ─────────────────────────────────────────────────── */
function Blocks({ pointerRef, glowMap, maskTarget, spill }) {
  const meshRef = useRef(null);
  const { camera, raycaster } = useThree();

  // very slightly rounded edges (more segments so the small radius stays smooth)
  const geometry = useMemo(() => new RoundedBoxGeometry(SIZE, HEIGHT, SIZE, 4, 0.02), []);
  const content = useMemo(() => buildBlockContent(), []);
  const atlas = useMemo(() => {
    const t = makeDecalAtlas(mulberry32(5));
    t.flipY = false;
    return t;
  }, []);
  const { front: glassMat, back: backMat, mask: maskMat } = useGlassMaterials(atlas);
  const backRef = useRef(null);
  const maskRef = useRef(null);
  const { gl, size, viewport } = useThree();
  const buffer = useFBO(
    Math.max(2, Math.round(size.width * viewport.dpr * BUFFER_SCALE)),
    Math.max(2, Math.round(size.height * viewport.dpr * BUFFER_SCALE)),
    { type: THREE.HalfFloatType },
  );
  // the back-face mesh reuses the front mesh's instance matrices
  useEffect(() => {
    if (meshRef.current && backRef.current) backRef.current.instanceMatrix = meshRef.current.instanceMatrix;
    if (meshRef.current && maskRef.current) {
      maskRef.current.instanceMatrix = meshRef.current.instanceMatrix;
      maskRef.current.layers.set(MASK_LAYER); // rendered only in the mask pass
    }
  }, []);

  // coins: one instanced mesh per coin type, each instance tied to a block index
  const coinRefs = useRef([]);
  const coinGeo = useMemo(() => new THREE.CylinderGeometry(0.3, 0.3, 0.07, 48).rotateX(Math.PI / 2), []);
  const coinSets = useMemo(
    () =>
      COINS.map((coin, t) => {
        const face = makeCoinFace(coin);
        const capMat = new THREE.MeshStandardMaterial({
          map: face,
          emissiveMap: face,
          emissive: new THREE.Color("#ffffff"),
          emissiveIntensity: 1.3,
          roughness: 0.4,
          metalness: 0.3,
        });
        const sideMat = new THREE.MeshStandardMaterial({ color: coin.bg, roughness: 0.35, metalness: 0.6 });
        const blocks = [];
        for (let i = 0; i < COUNT; i++) if (content.coin[i] === t) blocks.push(i);
        return { materials: [sideMat, capMat, capMat], blocks };
      }),
    [content],
  );

  const glowAttr = useMemo(() => new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1), []);
  const patternAttr = useMemo(() => new THREE.InstancedBufferAttribute(content.pattern, 1), [content]);
  const decalAttr = useMemo(() => new THREE.InstancedBufferAttribute(content.decal, 1), [content]);
  const decalFaceAttr = useMemo(() => new THREE.InstancedBufferAttribute(content.decalFace, 1), [content]);
  const innerAttr = useMemo(
    () => new THREE.InstancedBufferAttribute(Float32Array.from(content.coin, (c) => (c >= 0 ? 1 : 0)), 1),
    [content],
  );

  const state = useMemo(() => {
    const pos = new Float32Array(COUNT * 2);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        pos[i * 2] = c * PITCH - HALF_W;
        pos[i * 2 + 1] = r * PITCH - HALF_D;
      }
    }
    return { pos, glow: new Float32Array(COUNT), lift: new Float32Array(COUNT), liftVel: new Float32Array(COUNT) };
  }, []);

  useEffect(() => {
    geometry.setAttribute("aGlow", glowAttr);
    geometry.setAttribute("aPattern", patternAttr);
    geometry.setAttribute("aDecal", decalAttr);
    geometry.setAttribute("aDecalFace", decalFaceAttr);
    geometry.setAttribute("aInner", innerAttr);
  }, [geometry, glowAttr, patternAttr, decalAttr, decalFaceAttr, innerAttr]);

  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      hit: new THREE.Vector3(),
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), HEIGHT / 2),
      ray: new THREE.Ray(),
      box: new THREE.Box3(),
      ndc: new THREE.Vector2(),
      inv: new THREE.Matrix4(),
      e: new THREE.Euler(0, 0, 0, "YXZ"),
      q: new THREE.Quaternion(),
      v: new THREE.Vector3(),
      one: new THREE.Vector3(1, 1, 1),
      clear: new THREE.Color(),
    }),
    [],
  );

  useFrame((three, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dt = Math.min(delta, 1 / 20);
    const p = pointerRef.current;
    const { pos, glow, lift } = state;

    // resolve pointer → the block actually under the cursor (ray vs. each block's box),
    // so pointing at a block's side selects that block, not the one behind it
    let hx = 1e6;
    let hz = 1e6;
    let ndcX = p.x;
    let ndcY = p.y;
    if (!p.active) {
      // idle wander so the field still breathes on touch devices / when mouse is away
      const t = three.clock.elapsedTime * 0.35;
      ndcX = Math.sin(t * 1.3) * 0.55;
      ndcY = Math.sin(t * 0.9 + 1.2) * 0.35 - 0.05;
    }
    if (p.active || performance.now() - p.last > 2500) {
      tmp.ndc.set(ndcX, ndcY);
      raycaster.setFromCamera(tmp.ndc, camera);
      tmp.inv.copy(mesh.parent.matrixWorld).invert();
      tmp.ray.copy(raycaster.ray).applyMatrix4(tmp.inv);
      let best = Infinity;
      for (let i = 0; i < COUNT; i++) {
        const x = pos[i * 2];
        const z = pos[i * 2 + 1];
        // hit-test against the resting position: if the lifted box were used, the rising
        // block would uncover its neighbour under the cursor and selection would flicker
        tmp.box.min.set(x - SIZE / 2, -HEIGHT / 2, z - SIZE / 2);
        tmp.box.max.set(x + SIZE / 2, HEIGHT / 2, z + SIZE / 2);
        if (tmp.ray.intersectBox(tmp.box, tmp.hit)) {
          const d = tmp.hit.distanceToSquared(tmp.ray.origin);
          if (d < best) {
            best = d;
            hx = x;
            hz = z;
          }
        }
      }
      // cursor over a gap: fall back to the floor point
      if (best === Infinity && tmp.ray.intersectPlane(tmp.plane, tmp.hit)) {
        hx = tmp.hit.x;
        hz = tmp.hit.z;
      }
    }
    const active = hx !== 1e6;

    // linear progress; eased with smoothstep where used → light fades in like a lamp warming up
    const onStep = dt / 0.3; // ~0.3s to fully light
    const offStep = dt / 0.6; // a little slower fade out = short light trail
    // lift is a damped spring: overshoots a little on the way up and settles with a small bounce
    const SPRING_K = 170;
    const SPRING_C = 21; // near-critical: one soft overshoot, no wobbling
    const { liftVel } = state;
    const glowData = glowMap.image.data;

    for (let i = 0; i < COUNT; i++) {
      const x = pos[i * 2];
      const z = pos[i * 2 + 1];
      let target = 0;
      let liftTarget = 0;
      if (active) {
        const dx = Math.abs(x - hx);
        const dz = Math.abs(z - hz);
        const inCell = dx <= PITCH / 2 && dz <= PITCH / 2;
        target = inCell ? 1 : 0;
        liftTarget = inCell ? 1 : 0;
      }
      const g = glow[i];
      glow[i] = target > g ? Math.min(target, g + onStep) : Math.max(target, g - offStep);
      const acc = SPRING_K * (liftTarget - lift[i]) - SPRING_C * liftVel[i];
      liftVel[i] += acc * dt;
      lift[i] = Math.max(-0.04, lift[i] + liftVel[i] * dt);

      const y = lift[i] * LIFT;
      tmp.m.makeTranslation(x, y, z);
      mesh.setMatrixAt(i, tmp.m);
      glowAttr.array[i] = glow[i];

      // glow map texel (row flipped to match the floor's uv)
      const c = i % COLS;
      const r = (i / COLS) | 0;
      glowData[((ROWS - 1 - r) * COLS + c) * 4] = Math.min(255, ease(glow[i]) * 255);
    }
    mesh.instanceMatrix.needsUpdate = true;
    glowAttr.needsUpdate = true;
    glowMap.needsUpdate = true;

    // coins float inside their block: follow its lift, sway slowly, face the camera
    const t = three.clock.elapsedTime;
    coinSets.forEach((set, k) => {
      const cm = coinRefs.current[k];
      if (!cm) return;
      set.blocks.forEach((bi, j) => {
        const ph = bi * 1.37;
        // group is rotated 45°, so -45° yaw turns the coin face toward the camera
        tmp.e.set(-0.42, -Math.PI / 4 + Math.sin(t * 0.7 + ph) * 0.55, 0);
        tmp.q.setFromEuler(tmp.e);
        tmp.v.set(pos[bi * 2], lift[bi] * LIFT + Math.sin(t * 1.1 + ph) * 0.03, pos[bi * 2 + 1]);
        tmp.m.compose(tmp.v, tmp.q, tmp.one);
        cm.setMatrixAt(j, tmp.m);
      });
      cm.instanceMatrix.needsUpdate = true;
    });

    // ── see-through pre-pass: floor + coins + every cube's far faces (multiplied) ──
    const back = backRef.current;
    if (back) {
      mesh.visible = false;
      back.visible = true;
      // keep the floor's neon spill out of the see-through buffer: refracted, it would show
      // up displaced on the faces of neighbouring blocks instead of under the lit one
      spill.value = 0;
      gl.setRenderTarget(buffer);
      gl.render(three.scene, camera);
      gl.setRenderTarget(null);
      back.visible = false;
      mesh.visible = true;
      spill.value = 1;
      glassMat.uniforms.uBuffer.value = buffer.texture;
      gl.getDrawingBufferSize(glassMat.uniforms.uViewport.value);
    }

    // ── depth-of-field mask pass (only the mask layer, on black) ──
    if (maskTarget && maskRef.current && CORNER_BLUR_PX > 0) {
      const oldBg = three.scene.background;
      three.scene.background = null;
      gl.getClearColor(tmp.clear);
      const oldAlpha = gl.getClearAlpha();
      gl.setClearColor(0x000000, 1);
      camera.layers.set(MASK_LAYER);
      gl.setRenderTarget(maskTarget);
      gl.clear();
      gl.render(three.scene, camera);
      gl.setRenderTarget(null);
      camera.layers.set(0);
      gl.setClearColor(tmp.clear, oldAlpha);
      three.scene.background = oldBg;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, glassMat, COUNT]} frustumCulled={false} />
      <instancedMesh ref={backRef} args={[geometry, backMat, COUNT]} frustumCulled={false} visible={false} renderOrder={1} />
      <instancedMesh ref={maskRef} args={[geometry, maskMat, COUNT]} frustumCulled={false} />
      {coinSets.map((set, k) => (
        <instancedMesh
          key={COINS[k].key}
          ref={(el) => (coinRefs.current[k] = el)}
          args={[coinGeo, set.materials, set.blocks.length]}
          frustumCulled={false}
        />
      ))}
    </>
  );
}

/* Floor: circuit texture + blurred neon spill read from the per-block glow map.
   It's opaque, so the spill is also visible *through* neighbouring glass blocks. */
function Floor({ glowMap, spill }) {
  const tex = useMemo(() => makeFloorTexture(), []);
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uGlowMap = { value: glowMap };
      shader.uniforms.uTexel = { value: new THREE.Vector2(1 / COLS, 1 / ROWS) };
      shader.uniforms.uHalf = { value: SIZE / PITCH / 2 };
      shader.uniforms.uSpill = spill;
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform sampler2D uGlowMap;\nuniform vec2 uTexel;\nuniform float uHalf;\nuniform float uSpill;")
        .replace(
          "#include <map_fragment>",
          `#include <map_fragment>
          {
            // distance from this floor point to each nearby block's square footprint;
            // light falls off within the gap so it frames the block, not a big circle
            vec2 grid = vMapUv / uTexel;
            vec2 cell = floor(grid);
            float spill = 0.0;
            for (int ix = -1; ix <= 1; ix++) {
              for (int iy = -1; iy <= 1; iy++) {
                vec2 c = cell + vec2(float(ix), float(iy));
                float gl = texture2D(uGlowMap, (c + 0.5) * uTexel).r;
                vec2 q = max(abs(grid - (c + 0.5)) - uHalf, 0.0);
                spill = max(spill, gl * exp(-length(q) * 14.0));
              }
            }
            diffuseColor.rgb += vec3(0.03, 0.12, 1.0) * spill * 0.9 * uSpill;
          }`,
        );
    };
    return mat;
  }, [tex, glowMap, spill]);
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-HEIGHT / 2} material={material}>
      <planeGeometry args={[COLS * PITCH, ROWS * PITCH]} />
    </mesh>
  );
}

/* Responsive camera: pull back a bit on narrow screens so the field still fills */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    // ÷1.3 → blocks appear ~130% larger
    const dist = (aspect < 0.8 ? 16 : aspect < 1.3 ? 13 : 11) / 1.3;
    // low elevation (~30°) so only a sliver of each block's top face shows
    const elev = THREE.MathUtils.degToRad(30);
    camera.position.set(0, dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

const MASK_LAYER = 5;

function Scene({ pointerRef }) {
  const glowMap = useGlowMap();
  const { size, viewport } = useThree();
  const maskTarget = useFBO(
    Math.max(2, Math.round(size.width * viewport.dpr * 0.5)),
    Math.max(2, Math.round(size.height * viewport.dpr * 0.5)),
  );
  const cornerBlur = useMemo(() => new CornerBlurEffect(maskTarget.texture), [maskTarget]);
  const spill = useMemo(() => ({ value: 1 }), []);
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, FOG_NEAR, FOG_FAR]} />
      <ambientLight intensity={0.5} color="#c3c6d4" />
      <directionalLight position={[-6, 12, 5]} intensity={1.1} color="#eef0ff" />
      <directionalLight position={[7, 4, -5]} intensity={0.3} color="#9aa0c0" />
      {/* local studio environment (no network HDR) for soft glassy reflections */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.6} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[20, 20, 1]} color="#e8e9f0" />
        <Lightformer intensity={1.0} position={[-8, 3, 4]} rotation-y={Math.PI / 2} scale={[10, 4, 1]} color="#c4c7d8" />
        <Lightformer intensity={0.6} position={[8, 3, -4]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} color="#8088aa" />
      </Environment>
      <group rotation-y={Math.PI / 4}>
        <Floor glowMap={glowMap} spill={spill} />
        <Blocks pointerRef={pointerRef} glowMap={glowMap} maskTarget={maskTarget} spill={spill} />
      </group>
      <CameraRig />
      <EffectComposer multisampling={0} disableNormalPass>
        {CORNER_BLUR_PX > 0 && <primitive object={cornerBlur} />}
        {USE_BLOOM && <Bloom mipmapBlur luminanceThreshold={0.22} luminanceSmoothing={0.2} intensity={0.45} radius={0.35} />}
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </>
  );
}

/* ── section ───────────────────────────────────────────────── */
export default function CrystalCubeField3D() {
  const wrapRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, last: 0 });
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.75);
  const copyRef = useRef(null);
  useNavDarkZone(wrapRef);

  // headline + description stay put (fixed) while the block field scrolls up underneath,
  // then fade out as the field is almost gone and the next section takes over
  useEffect(() => {
    const section = wrapRef.current;
    const copy = copyRef.current;
    if (!section || !copy) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / rect.height)); // 0 = at top, 1 = field scrolled away
      const f = smoothstep(0.55, 0.9, p);
      copy.style.opacity = String(1 - f);
      copy.style.transform = `translateY(${-24 * f}px)`;
      copy.style.visibility = f >= 1 ? "hidden" : "visible";
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // pause rendering while off-screen
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const updatePointer = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    const p = pointerRef.current;
    p.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    p.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    p.active = true;
    p.last = performance.now();
  };
  const leave = () => {
    pointerRef.current.active = false;
    pointerRef.current.last = performance.now();
  };

  return (
    <section
      ref={wrapRef}
      id="home"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: 560, background: BG }}
      onPointerMove={updatePointer}
      onPointerDown={updatePointer}
      onPointerLeave={leave}
      onPointerCancel={leave}
    >
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        frameloop={visible ? "always" : "never"}
        dpr={dpr}
        camera={{ fov: 34, near: 0.1, far: 80, position: [0, 5, 8.7] }}
        gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.NeutralToneMapping }}
      >
        {/* drop resolution on slower GPUs instead of dropping frames */}
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
        <Scene pointerRef={pointerRef} />
      </Canvas>

      {/* thin dim layer so the centred headline reads over the blocks */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* edge vignette + blend into the next (video) section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${BG}ee 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0A0A)" }}
      />

      {/* centred headline with the description under it; wrapper ignores the pointer so the blocks stay interactive.
          Fixed to the viewport (scroll-driven fade above), under the nav (z 100), over the next section.
          Same side padding as the other sections (40px, 24px on mobile via .bf-pad). */}
      <div
        ref={copyRef}
        className="bf-pad pointer-events-none"
        style={{ position: "fixed", inset: 0, zIndex: 5, padding: "64px 40px 0", willChange: "opacity, transform" }}
      >
        <div style={{ position: "relative", maxWidth: 1400, height: "100%", margin: "0 auto" }}>
          <div className="bf-hero3d-main">
            <h1
              className="bf-hero3d-h"
              style={{ opacity: 0, animation: "revU 1s .15s ease both" }}
            >
              신뢰할 수 있는 디지털 자산의 기반을 만듭니다.
            </h1>
            <p className="bf-hero3d-desc" style={{ opacity: 0, animation: "revU 1s .3s ease both" }}>
              보난자팩토리는 가상자산 자금세탁방지(AML) 전문 기업입니다. 블록체인 거래 데이터를 분석해 위험한
              지갑과 자금 흐름을 찾아내고, 거래소와 은행이 위험 거래를 미리 확인하고 차단할 수 있도록 돕습니다.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
