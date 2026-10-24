import { ogSize, waterlineOg } from "@/lib/og";

export const alt = "Walter Morales, AI Engineer y Co-Founder de Ai Labs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return waterlineOg({
    top: "Walter Morales",
    bottom: "AI Engineer",
    note: "Co-Founder de Ai Labs",
  });
}
