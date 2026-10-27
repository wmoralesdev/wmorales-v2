import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Walter Morales",
    short_name: "Walter Morales",
    description:
      "AI Engineer y Co-Founder de Ai Labs · AI Engineer and Co-Founder of Ai Labs.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f2f7",
    theme_color: "#614afc",
    lang: "es",
    icons: [
      { src: "/wm.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/wm.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcuts: [
      { name: "Agendar llamada", url: "/book" },
      { name: "Tarjeta de presentación", url: "/intro" },
    ],
  };
}
