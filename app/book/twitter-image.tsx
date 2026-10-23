import { ogSize, waterlineOg } from "@/lib/og";

export const alt = "Agendá una llamada con Walter Morales, consultor de IA";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return waterlineOg({
    top: "Agendá una",
    bottom: "llamada",
    note: "wmorales.dev/book · Consultoría de IA",
  });
}
