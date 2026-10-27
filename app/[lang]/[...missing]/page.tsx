import { notFound } from "next/navigation";

// The root layout lives under [lang], so unknown URLs land here and render the
// localized not-found page instead of Next's bare default.
export default function Missing() {
  notFound();
}
