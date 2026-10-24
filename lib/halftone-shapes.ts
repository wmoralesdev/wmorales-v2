// Signed distance functions for the halftone icons. Coordinates run -1..1 with y
// pointing down (same as SVG); a negative value means "inside the shape". The icon
// samples these on a coarse grid and sizes each dot by how deep inside it sits,
// which is what gives the icons their big-core, small-edge halftone look.
//
// Formulas adapted from Inigo Quilez, https://iquilezles.org/articles/distfunctions2d/

type Sdf = (x: number, y: number) => number;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);

const circle = (x: number, y: number, r: number) => Math.hypot(x, y) - r;

function box(x: number, y: number, bx: number, by: number, r = 0) {
  const qx = Math.abs(x) - bx + r;
  const qy = Math.abs(y) - by + r;
  return (
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
    Math.min(Math.max(qx, qy), 0) -
    r
  );
}

function segment(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const px = x - ax;
  const py = y - ay;
  const ex = bx - ax;
  const ey = by - ay;
  const h = clamp((px * ex + py * ey) / (ex * ex + ey * ey), 0, 1);
  return Math.hypot(px - ex * h, py - ey * h);
}

function triangle(x: number, y: number, pts: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2]] = pts;
  const e = [
    [x1 - x0, y1 - y0],
    [x2 - x1, y2 - y1],
    [x0 - x2, y0 - y2],
  ];
  const v = [
    [x - x0, y - y0],
    [x - x1, y - y1],
    [x - x2, y - y2],
  ];
  const s = Math.sign(e[0][0] * e[2][1] - e[0][1] * e[2][0]);
  let dist = Infinity;
  let side = Infinity;
  for (let i = 0; i < 3; i++) {
    const [ex, ey] = e[i];
    const [vx, vy] = v[i];
    const h = clamp((vx * ex + vy * ey) / (ex * ex + ey * ey), 0, 1);
    dist = Math.min(dist, (vx - ex * h) ** 2 + (vy - ey * h) ** 2);
    side = Math.min(side, s * (vx * ey - vy * ex));
  }
  return -Math.sqrt(dist) * Math.sign(side);
}

function heart(x: number, y: number) {
  // iq's heart lives in 0..1 with y up; fit it to the icon box.
  const k = 0.68;
  const px = Math.abs(x) * k;
  const py = -y * k + 0.56;
  if (py + px > 1)
    return (Math.hypot(px - 0.25, py - 0.75) - Math.SQRT2 / 4) / k;
  const a = px ** 2 + (py - 1) ** 2;
  const m = 0.5 * Math.max(px + py, 0);
  const b = (px - m) ** 2 + (py - m) ** 2;
  return (Math.sqrt(Math.min(a, b)) * Math.sign(px - py)) / k;
}

export const shapes = {
  dot: (x, y) => circle(x, y, 0.62),
  target: (x, y) =>
    Math.min(Math.abs(circle(x, y, 0.7)) - 0.14, circle(x, y, 0.2)),
  // Four-point star, the usual shorthand for "AI".
  sparkle: (x, y) =>
    (Math.sqrt(Math.abs(x)) + Math.sqrt(Math.abs(y)) - 0.98) * 0.9,
  heart,
  plus: (x, y) => Math.min(box(x, y, 0.22, 0.82), box(x, y, 0.82, 0.22)),
  tiles: (x, y) =>
    box(Math.abs(x) - 0.46, Math.abs(y) - 0.46, 0.32, 0.32, 0.08),
  cursor: (x, y) =>
    Math.min(
      triangle(x, y, [
        [-0.62, -0.9],
        [-0.62, 0.55],
        [0.6, 0.18],
      ]),
      segment(x, y, -0.05, 0.25, 0.42, 0.88) - 0.15,
    ),
  cloud: (x, y) =>
    Math.min(
      circle(x + 0.38, y - 0.12, 0.38),
      circle(x - 0.02, y + 0.12, 0.5),
      circle(x - 0.45, y - 0.1, 0.36),
      box(x, y - 0.3, 0.78, 0.22, 0.1),
    ),
  chat: (x, y) =>
    Math.min(
      box(x, y + 0.15, 0.86, 0.58, 0.28),
      triangle(x, y, [
        [-0.5, 0.3],
        [-0.05, 0.3],
        [-0.6, 0.9],
      ]),
    ),
  calendar: (x, y) =>
    Math.min(
      Math.abs(box(x, y + 0.02, 0.8, 0.76, 0.12)) - 0.1,
      box(x, y + 0.48, 0.8, 0.12),
      circle(x + 0.32, y - 0.18, 0.15),
      circle(x - 0.12, y - 0.18, 0.15),
    ),
  arrow: (x, y) =>
    Math.min(
      box(x + 0.25, y, 0.55, 0.16),
      triangle(x, y, [
        [0.05, -0.62],
        [0.05, 0.62],
        [0.85, 0],
      ]),
    ),
  ring: (x, y) => Math.abs(circle(x, y, 0.66)) - 0.2,
} satisfies Record<string, Sdf>;

export type ShapeName = keyof typeof shapes;
