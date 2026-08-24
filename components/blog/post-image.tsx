"use client";

import * as stylex from "@stylexjs/stylex";
import Image from "next/image";
import { useState } from "react";
import { colors, fonts, radii } from "@/lib/stylex/tokens.stylex";

type PostImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

const styles = stylex.create({
  figure: {
    marginBlock: "2rem",
  },
  frame: {
    position: "relative",
    aspectRatio: "16 / 9",
    width: "100%",
    overflow: "hidden",
    borderRadius: radii.lg,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${colors.border}, transparent 50%)`,
    backgroundColor: `color-mix(in oklch, ${colors.muted}, transparent 70%)`,
  },
  image: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    transitionProperty: "opacity",
    transitionDuration: "200ms",
  },
  loaded: {
    opacity: 1,
  },
  unloaded: {
    opacity: 0,
  },
  caption: {
    marginTop: "0.5rem",
    textAlign: "center",
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    color: colors.mutedForeground,
  },
});

function isRemoteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function PostImage({ src, alt, caption }: PostImageProps) {
  const isRemote = isRemoteUrl(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <figure {...stylex.props(styles.figure)}>
      <div {...stylex.props(styles.frame)}>
        {isRemote ? (
          // biome-ignore lint/performance/noImgElement: remote covers may be outside next/image hosts
          <img
            alt={alt}
            loading="lazy"
            src={src}
            onLoad={() => setIsLoaded(true)}
            {...stylex.props(
              styles.image,
              isLoaded ? styles.loaded : styles.unloaded,
            )}
          />
        ) : (
          <Image
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            src={src}
            onLoad={() => setIsLoaded(true)}
            {...stylex.props(
              styles.image,
              isLoaded ? styles.loaded : styles.unloaded,
            )}
          />
        )}
      </div>
      {caption && (
        <figcaption {...stylex.props(styles.caption)}>{caption}</figcaption>
      )}
    </figure>
  );
}
