type VideoProps = {
  src: string;
  title?: string;
  poster?: string;
  captions?: string;
};

export function Video({ src, title, poster, captions }: VideoProps) {
  return (
    <div className="my-8">
      <video
        className="w-full rounded-lg shadow-lg"
        controls
        poster={poster}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        {captions && (
          <track
            default
            kind="captions"
            label="English"
            src={captions}
            srcLang="en"
          />
        )}
        Your browser does not support the video tag.
      </video>
      {title && (
        <p className="mt-2 text-center text-gray-400 text-sm">{title}</p>
      )}
    </div>
  );
}
