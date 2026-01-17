"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PostImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

function isRemoteUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function PostImage({ src, alt, caption }: PostImageProps) {
  const isRemote = isRemoteUrl(src);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50 bg-muted/30">
        {isRemote ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-200",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            src={src}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <Image
            alt={alt}
            className={cn(
              "object-cover transition-opacity duration-200",
              isLoaded ? "opacity-100" : "opacity-0",
            )}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            src={src}
            onLoad={() => setIsLoaded(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
