/**
 * A brand logo printed as halftone: the site's dot screen, masked by the logo's
 * silhouette. Dots take the text colour, so a logo follows the theme like the
 * halftone icons do. `src` is a single-silhouette SVG in /public/logos.
 *
 * The dot pitch is fixed in pixels, so every logo shares one screen whatever its
 * size. `scale` evens out optical weight between marks (a thin ring next to a
 * solid block) without changing that pitch. Motion lives in globals.css
 * (.halftone-logo): the dots print in as the logo scrolls into view, and pulse
 * when the pointer is over the closest `.group`.
 *
 * Decorative: always render the brand's name in text next to it.
 */
export function HalftoneLogo({
  src,
  scale = 1,
  className = "",
}: {
  src: string;
  scale?: number;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={`relative block ${className}`}>
      <span
        className="halftone-logo dot-screen absolute"
        style={{
          inset: `${((1 - scale) / 2) * 100}%`,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
        }}
      />
    </span>
  );
}
