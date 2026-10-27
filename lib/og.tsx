import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { portraitDots } from "@/lib/portrait-dots";

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) =>
  readFile(path.join(process.cwd(), "assets/fonts", file));

const PAPER = "#f3f2f7";
const ACCENT = "#614afc";
const SNOW = "#f3f2f7";

// Where the water meets the paper on the card, and where the portrait sits.
const SEAM = 336;
const PORTRAIT_W = 420;
const PORTRAIT_TOP = 20;

/**
 * The hero portrait as a static SVG: accent dots that print the shadows above the
 * seam (on its own sheet of paper, as on the site), snow dots that print the
 * highlights below it. It sits high, like the hero, so the face stays above water.
 */
function portraitSvg() {
  const step = 1;
  const cols = Math.floor(portraitDots.cols / step);
  const rows = Math.floor(portraitDots.rows / step);
  const cell = PORTRAIT_W / (cols + 0.5);
  const h = rows * cell;
  const seam = SEAM - PORTRAIT_TOP;
  let above = "";
  let below = "";
  for (let y = 0; y < rows; y++) {
    const cy = y * cell + cell / 2;
    const offset = y % 2 ? cell / 2 : 0;
    for (let x = 0; x < cols; x++) {
      const lum =
        portraitDots.data[y * step * portraitDots.cols + x * step] / 99;
      const isAbove = cy < seam;
      const r = (isAbove ? (1 - lum) ** 1.15 : lum ** 0.85) * cell * 0.62;
      if (r < 0.4) continue;
      const dot = `<circle cx="${(x * cell + cell / 2 + offset).toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}"/>`;
      if (isAbove) above += dot;
      else below += dot;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_W}" height="${h.toFixed(0)}" viewBox="0 0 ${PORTRAIT_W} ${h.toFixed(1)}"><rect width="${PORTRAIT_W}" height="${seam.toFixed(1)}" fill="${PAPER}"/><g fill="${ACCENT}">${above}</g><g fill="${SNOW}">${below}</g></svg>`;
  return {
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    height: Math.round(h),
  };
}

/** Waterline card shared by every Open Graph image, with the halftone portrait crossing the seam. */
export async function waterlineOg({
  top,
  bottom,
  note,
}: {
  top: string;
  bottom: string;
  note: string;
}) {
  const [display, text] = await Promise.all([
    font("PlusJakartaSans-ExtraBold.woff"),
    font("PlusJakartaSans-SemiBold.woff"),
  ]);
  const headline = {
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 800,
    fontSize: 92,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  };

  const portrait = portraitSvg();

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f3f2f7",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: SEAM - 6,
          padding: "44px 56px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Plus Jakarta Sans",
            fontSize: 26,
            color: "#120d26",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              background: "#120d26",
              color: "#f3f2f7",
              fontFamily: "Plus Jakarta Sans",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            WM
          </div>
          wmorales.dev
        </div>
        <div style={{ ...headline, display: "flex", color: "#614afc" }}>
          {top}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          height: 12,
          backgroundImage:
            "radial-gradient(circle, #614afc 32%, transparent 34%)",
          backgroundSize: "10px 10px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          background: "#614afc",
          padding: "4px 56px 40px",
        }}
      >
        <div style={{ ...headline, display: "flex", color: "#120d26" }}>
          {bottom}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Plus Jakarta Sans",
            fontSize: 30,
            color: "#f3f2f7",
          }}
        >
          {note}
        </div>
      </div>
      {/* biome-ignore lint/performance/noImgElement: ImageResponse renders plain HTML, not next/image. */}
      <img
        src={portrait.src}
        alt=""
        width={PORTRAIT_W}
        height={portrait.height}
        style={{ position: "absolute", right: 48, top: PORTRAIT_TOP }}
      />
    </div>,
    {
      ...ogSize,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: display,
          weight: 800,
          style: "normal",
        },
        { name: "Plus Jakarta Sans", data: text, weight: 600, style: "normal" },
      ],
    },
  );
}
