import Image from "next/image";

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

  return (
    <figure className="my-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/50">
        {isRemote ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={alt}
            className="h-full w-full object-cover"
            loading="lazy"
            src={src}
          />
        ) : (
          <Image
            alt={alt}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            src={src}
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
