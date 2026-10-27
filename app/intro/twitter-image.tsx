import { ogSize, waterlineOg } from "@/lib/og";

export const alt =
  "Walter Morales: Ai Labs, MediConecto y programas de embajador";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return waterlineOg({
    top: "Walter Morales",
    bottom: "Intro",
    note: "Ai Labs · MediConecto · Embajador",
  });
}
