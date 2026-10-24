import { ogSize, waterlineOg } from "@/lib/og";

export const alt = "Walter Morales, consultor de IA en El Salvador";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return waterlineOg({
    top: "Consultor de IA",
    bottom: "en El Salvador",
    note: "wmorales.dev/consultor-de-ia",
  });
}
