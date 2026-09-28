/* Simplified, hand-drawn canvas versions of coin marks for the 3D cube field.
   They are stylised approximations (not the official artwork) — swap in the
   official SVGs later if exact brand marks are required.                       */
import * as THREE from "three";

export const COINS = [
  { key: "eth", bg: "#627EEA" },
  { key: "btc", bg: "#F7931A" },
  { key: "usdt", bg: "#26A17B" },
  { key: "xrp", bg: "#23292F" },
  { key: "usdc", bg: "#2775CA" },
  { key: "trx", bg: "#EB0029" },
  { key: "arb", bg: "#213147" },
  { key: "sol", bg: "#101014" },
];

// atlas slots after the 8 coin marks
export const DECAL_CODE = 8;
export const DECAL_ARROW = 9;
export const DECAL_COUNT = 10;
const ATLAS_GRID = 4; // 4×4 slots

/* Draw one mark centred at (0,0) in a [-1,1] box. `fg` = mark colour. */
function drawMark(ctx, key, fg) {
  ctx.fillStyle = fg;
  ctx.strokeStyle = fg;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  switch (key) {
    case "eth": {
      ctx.beginPath();
      ctx.moveTo(0, -0.78);
      ctx.lineTo(0.46, 0.02);
      ctx.lineTo(0, 0.28);
      ctx.lineTo(-0.46, 0.02);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0.38);
      ctx.lineTo(0.46, 0.12);
      ctx.lineTo(0, 0.78);
      ctx.lineTo(-0.46, 0.12);
      ctx.closePath();
      ctx.fill();
      // facet shading
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(0, -0.78);
      ctx.lineTo(0.46, 0.02);
      ctx.lineTo(0, 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0.38);
      ctx.lineTo(0.46, 0.12);
      ctx.lineTo(0, 0.78);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }
    case "btc": {
      ctx.save();
      ctx.rotate(0.24);
      ctx.font = "900 1.35px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("B", 0.02, 0.06);
      // the two strokes through the B
      ctx.fillRect(-0.2, -0.78, 0.12, 0.26);
      ctx.fillRect(0.04, -0.78, 0.12, 0.26);
      ctx.fillRect(-0.2, 0.52, 0.12, 0.26);
      ctx.fillRect(0.04, 0.52, 0.12, 0.26);
      ctx.restore();
      break;
    }
    case "usdt": {
      ctx.fillRect(-0.55, -0.58, 1.1, 0.26);
      ctx.fillRect(-0.14, -0.58, 0.28, 1.25);
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.ellipse(0, -0.06, 0.62, 0.17, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case "xrp": {
      ctx.lineWidth = 0.17;
      ctx.beginPath();
      ctx.moveTo(-0.62, -0.6);
      ctx.quadraticCurveTo(0, 0.12, 0.62, -0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-0.62, 0.6);
      ctx.quadraticCurveTo(0, -0.12, 0.62, 0.6);
      ctx.stroke();
      break;
    }
    case "usdc": {
      ctx.lineWidth = 0.1;
      ctx.beginPath();
      ctx.arc(0, 0, 0.7, Math.PI * 0.62, Math.PI * 1.38);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 0.7, -Math.PI * 0.38, Math.PI * 0.38);
      ctx.stroke();
      ctx.font = "800 1.0px Arial, Helvetica, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("$", 0, 0.05);
      break;
    }
    case "trx": {
      ctx.lineWidth = 0.09;
      const A = [-0.62, -0.5];
      const B = [0.66, -0.2];
      const C = [-0.05, 0.72];
      const D = [0.12, -0.05];
      ctx.beginPath();
      ctx.moveTo(...A);
      ctx.lineTo(...B);
      ctx.lineTo(...C);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(...A);
      ctx.lineTo(...D);
      ctx.lineTo(...C);
      ctx.moveTo(...D);
      ctx.lineTo(...B);
      ctx.stroke();
      break;
    }
    case "arb": {
      ctx.lineWidth = 0.09;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = -Math.PI / 2 + (k * Math.PI) / 3;
        const x = Math.cos(a) * 0.74;
        const y = Math.sin(a) * 0.74;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.lineWidth = 0.16;
      ctx.beginPath();
      ctx.moveTo(-0.34, 0.44);
      ctx.lineTo(0.02, -0.4);
      ctx.moveTo(0.02, -0.4);
      ctx.lineTo(0.38, 0.44);
      ctx.stroke();
      break;
    }
    case "sol": {
      const bar = (y, dir) => {
        ctx.beginPath();
        const s = 0.18 * dir;
        ctx.moveTo(-0.6 + s, y - 0.1);
        ctx.lineTo(0.6 + s, y - 0.1);
        ctx.lineTo(0.6 - s, y + 0.1);
        ctx.lineTo(-0.6 - s, y + 0.1);
        ctx.closePath();
        ctx.fill();
      };
      bar(-0.42, 1);
      bar(0, -1);
      bar(0.42, 1);
      break;
    }
    default:
  }
}

function drawCode(ctx, rand) {
  ctx.font = "0.085px 'Courier New', monospace";
  ctx.textBaseline = "top";
  const words = ["const", "hash", "=", "sign(", "tx", ")", "verify", "0x", "block", "nonce", "if", "return", "{", "}", "=>", "await", "chain"];
  for (let l = 0; l < 17; l++) {
    const indent = (rand() * 3) | 0;
    let line = "  ".repeat(indent);
    const n = 2 + ((rand() * 5) | 0);
    for (let w = 0; w < n; w++) line += words[(rand() * words.length) | 0] + " ";
    if (rand() > 0.6) line += "0x" + Math.floor(rand() * 1e8).toString(16);
    ctx.fillText(line, -0.86, -0.9 + l * 0.106);
  }
}

function drawArrow(ctx) {
  ctx.lineWidth = 0.2;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(-0.5, -0.5);
  ctx.lineTo(0.42, 0.42);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0.52, -0.1);
  ctx.lineTo(0.52, 0.52);
  ctx.lineTo(-0.1, 0.52);
  ctx.closePath();
  ctx.fill();
}

function makeCanvasTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* White marks on transparent, 4×4 atlas: slots 0-7 coins, 8 code, 9 arrow. */
export function makeDecalAtlas(rand) {
  const cell = 256;
  const px = cell * ATLAS_GRID;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  for (let i = 0; i < DECAL_COUNT; i++) {
    const cx = (i % ATLAS_GRID) * cell + cell / 2;
    const cy = Math.floor(i / ATLAS_GRID) * cell + cell / 2;
    ctx.save();
    ctx.translate(cx, cy);
    if (i < COINS.length) {
      ctx.scale(cell * 0.34, cell * 0.34); // logo printed on the face
      drawMark(ctx, COINS[i].key, "#fff");
    } else if (i === DECAL_CODE) {
      ctx.scale(cell * 0.47, cell * 0.47);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      drawCode(ctx, rand);
    } else {
      ctx.scale(cell * 0.3, cell * 0.3);
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#fff";
      drawArrow(ctx);
    }
    ctx.restore();
  }
  return makeCanvasTexture(canvas);
}

export const ATLAS_SLOTS = ATLAS_GRID;

/* Coloured coin face for the coins floating inside the glass. */
export function makeCoinFace(coin) {
  const px = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  ctx.translate(px / 2, px / 2);
  ctx.scale(px / 2, px / 2);
  if (coin.key === "sol") {
    const g = ctx.createLinearGradient(-1, 1, 1, -1);
    g.addColorStop(0, "#9945FF");
    g.addColorStop(1, "#14F195");
    ctx.fillStyle = coin.bg;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.scale(0.62, 0.62);
    drawMark(ctx, "sol", g);
  } else {
    ctx.fillStyle = coin.bg;
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.scale(0.6, 0.6);
    drawMark(ctx, coin.key, coin.key === "arb" ? "#28A0F0" : "#fff");
  }
  return makeCanvasTexture(canvas);
}
