import Image from 'next/image';

type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  priority?: boolean;
};

export function ImageComponent({
  src,
  alt,
  width = 800,
  height = 400,
  caption,
  priority = false,
}: ImageProps) {
  return (
    <figure className="my-8">
      <Image
        alt={alt || ''}
        className="rounded-lg shadow-lg"
        height={height}
        priority={priority}
        src={src}
        width={width}
      />
      {caption && (
        <figcaption className="mt-2 text-center text-gray-400 text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
