import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) =>
  readFile(path.join(process.cwd(), "assets/fonts", file));

/** Waterline card shared by every Open Graph image. */
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
    font("BigShoulders-ExtraBold.ttf"),
    font("PublicSans-SemiBold.ttf"),
  ]);
  const headline = {
    fontFamily: "Big Shoulders",
    fontSize: 150,
    lineHeight: 0.9,
    textTransform: "uppercase" as const,
    letterSpacing: "-0.005em",
  };

  return new ImageResponse(
    <div
      style={{
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
          height: 330,
          padding: "44px 56px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Public Sans",
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
              fontFamily: "Big Shoulders",
              fontSize: 28,
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
            fontFamily: "Public Sans",
            fontSize: 30,
            color: "#f3f2f7",
          }}
        >
          {note}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Big Shoulders", data: display, weight: 800, style: "normal" },
        { name: "Public Sans", data: text, weight: 600, style: "normal" },
      ],
    },
  );
}
