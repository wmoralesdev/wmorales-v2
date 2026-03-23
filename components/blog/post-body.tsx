type PostBodyProps = {
  contentHtml: string;
};

export function PostBody({ contentHtml }: PostBodyProps) {
  return (
    <div
      className="prose-minimal"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: contentHtml is generated server-side
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
