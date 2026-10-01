import * as THREE from "three";

/** World-unit dimensions for the badge. Sleeve origin is the physics body origin. */
export const DIM = {
  cardW: 1.5,
  cardH: 1.5 * (1720 / 1080),
  cardT: 0.022,
  sleeveW: 1.66,
  sleeveH: 2.86,
  sleeveT: 0.05,
  margin: 0.08,
  slotY: 0, // set below
  jointY: 0, // set below
};
DIM.slotY = DIM.sleeveH / 2 - 0.17;
DIM.jointY = DIM.slotY + 0.36;
/** Card sits at the bottom of the sleeve pocket. */
export const CARD_Y = -DIM.sleeveH / 2 + DIM.margin + DIM.cardH / 2;

function roundedRect<T extends THREE.Path>(shape: T, w: number, h: number, r: number, cx = 0, cy = 0): T {
  const x = cx - w / 2;
  const y = cy - h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** Remaps UVs of a flat geometry to 0..1 over its bounding box. */
function normalizeUV(geo: THREE.BufferGeometry, w: number, h: number) {
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
  uv.needsUpdate = true;
}

export function makeCardGeometries() {
  const { cardW: w, cardH: h, cardT: t } = DIM;
  const r = 0.07;
  const shape = roundedRect(new THREE.Shape(), w, h, r);
  const body = new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 2,
    curveSegments: 10,
  });
  body.translate(0, 0, -t / 2);
  const face = new THREE.ShapeGeometry(shape, 8);
  normalizeUV(face, w, h);
  return { body, face };
}

export function makeSleeveGeometry() {
  const { sleeveW: w, sleeveH: h, sleeveT: t, slotY } = DIM;
  const shape = roundedRect(new THREE.Shape(), w, h, 0.1);
  shape.holes.push(roundedRect(new THREE.Path(), 0.48, 0.08, 0.04, 0, slotY));
  for (const sx of [-1, 1]) {
    const hole = new THREE.Path();
    hole.absarc(sx * (w / 2 - 0.16), slotY, 0.04, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: t,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 10,
  });
  geo.translate(0, 0, -t / 2);
  return geo;
}
