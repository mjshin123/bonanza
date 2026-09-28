import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { COINS, DECAL_CODE, DECAL_ARROW, ATLAS_SLOTS, makeDecalAtlas, makeCoinFace } from "./coinLogos.js";

/* ── feature flags ─────────────────────────────────────────── */
const SHOW_CONTENT = false; // coins inside + printed logos/code/arrows (true → show them)
const USE_BLOOM = true; // neon bloom post-process (false → turn it off entirely)
const GLASS_SAMPLES = 6; // MeshTransmissionMaterial blur samples (lower = faster)
const GLASS_RESOLUTION = 512; // refraction buffer size (lower = faster, blurrier)

/* ── grid config ───────────────────────────────────────────── */
const COLS = 22;
const ROWS = 22;
const SIZE = 1; // block width/depth
const HEIGHT = 1; // cube, like the reference image
const GAP = 0.55;
const PITCH = SIZE + GAP;
const LIFT = 0.42; // hovered block rise
const BG = "#0b0c11";
const FOG_NEAR = 9;
const FOG_FAR = 23;

const COUNT = COLS * ROWS;
const HALF_W = ((COLS - 1) * PITCH) / 2;
const HALF_D = ((ROWS - 1) * PITCH) / 2;

/* ── helpers ───────────────────────────────────────────────── */
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
    const q = rand();
    pattern[i] = q < 0.1 ? 1 : q < 0.2 ? 2 : 0;
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

/* ── block material: frosted glass via drei MeshTransmissionMaterial ──
   (was MeshPhysicalMaterial in CoinCubeField3D.jsx)
   MeshPhysicalMaterial transmission → the floor, circuit lines and neon spill
   show through the blocks, blurred by roughness. Injected on top:
   - hairline edge highlight + etched micro grid / dots
   - per-instance neon glow (aGlow) as *emission*, so a lit block brightens and
     shines instead of just turning a darker blue                                  */
/* Our additions (neon glow, edge hairline, patterns, printed marks) are layered on top
   of drei's MeshTransmissionMaterial shader, which runs its own onBeforeCompile first. */
function injectBlockShader(shader, atlas) {
  shader.uniforms.uHeight = { value: HEIGHT };
  shader.uniforms.uAtlas = { value: atlas };
  shader.uniforms.uSlots = { value: ATLAS_SLOTS };
  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      `#include <common>
      attribute float aGlow;
      attribute float aPattern;
      attribute float aDecal;
      attribute float aDecalFace;
      attribute float aInner;
      varying float vInner;
      varying float vGlow;
      varying float vPattern;
      varying float vDecal;
      varying float vDecalFace;
      varying vec3 vObjPos;
      varying vec3 vObjNormal;`,
    )
    .replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      vGlow = aGlow;
      vPattern = aPattern;
      vDecal = aDecal;
      vDecalFace = aDecalFace;
      vInner = aInner;
      vObjPos = position;
      vObjNormal = normal;`,
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
      uniform float uHeight;
      uniform sampler2D uAtlas;
      uniform float uSlots;
      varying float vGlow;
      varying float vPattern;
      varying float vDecal;
      varying float vDecalFace;
      varying float vInner;
      varying vec3 vObjPos;
      varying vec3 vObjNormal;
      float bfGrid(vec2 uv, float n) {
        vec2 g = uv * n;
        vec2 w = fwidth(g);
        vec2 a = abs(fract(g - 0.5) - 0.5) / max(w, 1e-4);
        return 1.0 - min(min(a.x, a.y), 1.0);
      }`,
    )
    .replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      vec3 bfAn = abs(vObjNormal);
      bool bfTop = vObjNormal.y > 0.5;
      vec2 bfUv;
      if (bfAn.y > bfAn.x && bfAn.y > bfAn.z) bfUv = vObjPos.xz;
      else if (bfAn.x > bfAn.z) bfUv = vec2(vObjPos.z, vObjPos.y / uHeight);
      else bfUv = vec2(vObjPos.x, vObjPos.y / uHeight);
      float bfE = max(abs(bfUv.x), abs(bfUv.y));
      float bfG = smoothstep(0.0, 1.0, vGlow);
      // lit block: body tints to saturated blue (the light itself comes from emission below)
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.01, 0.05, 0.6), bfG);`,
    )
    // lit block keeps some transmission so the coin inside stays visible
    .replace(
      "material.transmission = _transmission;",
      "material.transmission = _transmission * (1.0 - 0.45 * bfG * (1.0 - vInner));",
    )
    .replace(
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
      {
        // hairline edge highlight
        float ew = fwidth(bfE) * 1.5;
        float edge = smoothstep(0.5 - ew - 0.006, 0.5 - 0.002, bfE);
        totalEmissiveRadiance += vec3(0.035, 0.037, 0.05) * edge;
        // etched micro pattern
        vec2 puv = bfUv + 0.5;
        if (vPattern > 0.5 && vPattern < 1.5) {
          totalEmissiveRadiance += vec3(0.008, 0.009, 0.013) * bfGrid(puv, 12.0);
        } else if (vPattern > 1.5) {
          vec2 f = fract(puv * 14.0) - 0.5;
          totalEmissiveRadiance += vec3(0.009, 0.01, 0.016) * (1.0 - smoothstep(0.06, 0.12, length(f)));
        }
        // neon emission: glowing inner core + hot edges, strongest on the top face
        float core = 1.0 - smoothstep(0.0, 0.6, length(bfUv - (bfTop ? vec2(0.0) : vec2(-0.05, 0.1))));
        // kept strongly blue-dominant so tone mapping doesn't bleach it to white
        float lightSide = bfTop ? 0.8 : (bfUv.x < 0.0 ? 0.68 : 0.55);
        vec3 neon = vec3(0.012, 0.075, 1.0) * lightSide;
        // soft brighter bloom inside, toward the upper-left like the reference
        neon += vec3(0.02, 0.07, 0.3) * (1.0 - smoothstep(0.0, 0.7, length(bfUv - vec2(-0.15, 0.18))));
        neon += vec3(0.12, 0.22, 0.7) * edge;
        // a block holding a coin glows softer so the coin reads through the blue glass
        totalEmissiveRadiance = mix(totalEmissiveRadiance, neon * mix(1.0, 0.4, vInner), bfG);

        // white mark printed on one of the visible faces
        if (vDecal > -0.5) {
          float faceId = vObjNormal.y > 0.5 ? 2.0 : (vObjNormal.x < -0.5 ? 0.0 : (vObjNormal.z > 0.5 ? 1.0 : -1.0));
          if (abs(faceId - vDecalFace) < 0.5) {
            vec2 duv;
            if (faceId < 0.5) duv = vec2(vObjPos.z + 0.5, vObjPos.y / uHeight + 0.5);
            else if (faceId < 1.5) duv = vec2(vObjPos.x + 0.5, vObjPos.y / uHeight + 0.5);
            // top face is seen as a diamond: rotate 45° so the mark stands upright on screen
            else duv = vec2(vObjPos.x + vObjPos.z, vObjPos.x - vObjPos.z) * 0.7071 + 0.5;
            // atlas is uploaded with flipY = false → v runs top-down like the canvas
            float slot = floor(vDecal + 0.5);
            float col = mod(slot, uSlots);
            float row = floor(slot / uSlots + 0.001);
            vec2 auv = vec2((col + duv.x) / uSlots, (row + 1.0 - duv.y) / uSlots);
            float a = texture2D(uAtlas, auv).a;
            totalEmissiveRadiance += vec3(mix(0.42, 0.95, bfG)) * a;
          }
        }
      }`,
    );
}


/* ── scene ─────────────────────────────────────────────────── */
function Blocks({ pointerRef, glowMap }) {
  const meshRef = useRef(null);
  const { camera, raycaster } = useThree();

  // nearly sharp edges — just enough bevel to catch a highlight
  const geometry = useMemo(() => new RoundedBoxGeometry(SIZE, HEIGHT, SIZE, 2, 0.012), []);
  const content = useMemo(() => buildBlockContent(), []);
  const atlas = useMemo(() => {
    const t = makeDecalAtlas(mulberry32(5));
    t.flipY = false;
    return t;
  }, []);
  const glassRef = useRef(null);
  // chain our shader injection after MeshTransmissionMaterial's own onBeforeCompile
  useLayoutEffect(() => {
    const mat = glassRef.current;
    if (!mat || mat.__bfWrapped) return;
    const base = mat.onBeforeCompile;
    mat.onBeforeCompile = (shader, renderer) => {
      base.call(mat, shader, renderer);
      injectBlockShader(shader, atlas);
    };
    mat.customProgramCacheKey = () => "bf-glass-block";
    mat.__bfWrapped = true;
    mat.needsUpdate = true;
  }, [atlas]);

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
    return { pos, glow: new Float32Array(COUNT), lift: new Float32Array(COUNT) };
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
        const y = lift[i] * LIFT;
        tmp.box.min.set(x - SIZE / 2, y - HEIGHT / 2, z - SIZE / 2);
        tmp.box.max.set(x + SIZE / 2, y + HEIGHT / 2, z + SIZE / 2);
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

    const rise = 1 - Math.exp(-dt * 9);
    const fall = 1 - Math.exp(-dt * 2.2); // slow fade = light trail
    const liftK = 1 - Math.exp(-dt * 8);
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
      glow[i] = g + (target - g) * (target > g ? rise : fall);
      lift[i] += (liftTarget - lift[i]) * liftK;

      const y = lift[i] * LIFT;
      tmp.m.makeTranslation(x, y, z);
      mesh.setMatrixAt(i, tmp.m);
      glowAttr.array[i] = glow[i];

      // glow map texel (row flipped to match the floor's uv)
      const c = i % COLS;
      const r = (i / COLS) | 0;
      glowData[((ROWS - 1 - r) * COLS + c) * 4] = Math.min(255, glow[i] * 255);
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
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[geometry, undefined, COUNT]} frustumCulled={false}>
        <MeshTransmissionMaterial
          ref={glassRef}
          samples={GLASS_SAMPLES}
          resolution={GLASS_RESOLUTION}
          // frosted like the reference, not clear glass
          transmission={1}
          roughness={0.28}
          thickness={0.6}
          ior={1.3}
          chromaticAberration={0.02}
          anisotropicBlur={0.2}
          distortion={0.08}
          distortionScale={0.4}
          temporalDistortion={0}
          color="#555866"
          attenuationColor="#6a6d7c"
          attenuationDistance={2.2}
          clearcoat={0.25}
          clearcoatRoughness={0.5}
          specularIntensity={0.5}
          envMapIntensity={0.9}
          emissive="#1a1c26"
          emissiveIntensity={1}
        />
      </instancedMesh>
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
function Floor({ glowMap }) {
  const tex = useMemo(() => makeFloorTexture(), []);
  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uGlowMap = { value: glowMap };
      shader.uniforms.uTexel = { value: new THREE.Vector2(1 / COLS, 1 / ROWS) };
      shader.uniforms.uHalf = { value: SIZE / PITCH / 2 };
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform sampler2D uGlowMap;\nuniform vec2 uTexel;\nuniform float uHalf;")
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
            diffuseColor.rgb += vec3(0.03, 0.12, 1.0) * spill * 0.9;
          }`,
        );
    };
    return mat;
  }, [tex, glowMap]);
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
    const dist = aspect < 0.8 ? 16 : aspect < 1.3 ? 13 : 11;
    // low elevation (~30°) so only a sliver of each block's top face shows
    const elev = THREE.MathUtils.degToRad(30);
    camera.position.set(0, dist * Math.sin(elev), dist * Math.cos(elev));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Scene({ pointerRef }) {
  const glowMap = useGlowMap();
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
        <Floor glowMap={glowMap} />
        <Blocks pointerRef={pointerRef} glowMap={glowMap} />
      </group>
      <CameraRig />
      {USE_BLOOM && (
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom mipmapBlur luminanceThreshold={0.1} luminanceSmoothing={0.2} intensity={0.9} radius={0.6} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      )}
    </>
  );
}

/* ── section ───────────────────────────────────────────────── */
export default function GlassCubeField3D() {
  const wrapRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false, last: 0 });
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState(1.75);
  useNavDarkZone(wrapRef);

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

      {/* thin dim layer + headline (pointer-events off so the blocks stay interactive) */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <h1
          className="bf-hero-h"
          style={{
            margin: 0,
            textAlign: "center",
            color: "#fff",
            fontWeight: 500,
            fontSize: "clamp(28px, 4.2vw, 60px)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            opacity: 0,
            animation: "revU 1s .15s ease both",
          }}
        >
          신뢰할 수 있는
          <br />
          디지털 자산의 기반을 만듭니다.
        </h1>
      </div>

      {/* edge vignette + blend into the next (video) section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 45%, ${BG}ee 100%)` }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to bottom, transparent, #0A0A0A)" }}
      />

      {/* scroll hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-[11px] tracking-[0.3em] text-white/50">
        <span>SCROLL</span>
        <span className="block h-8 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
