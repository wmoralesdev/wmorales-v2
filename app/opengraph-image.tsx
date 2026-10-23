import { ogSize, waterlineOg } from "@/lib/og";

export const alt = "Walter Morales, consultor de IA y fundador de Ai Labs";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return waterlineOg({
    top: "Walter Morales",
    bottom: "Consultor de IA",
    note: "Fundador de Ai Labs · Cursor Ambassador El Salvador",
  });
}
