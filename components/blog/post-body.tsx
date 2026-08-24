type PostBodyProps = {
  contentHtml: string;
};

export function PostBody({ contentHtml }: PostBodyProps) {
  return (
    <div
      className="prose-minimal"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: post HTML is generated from trusted markdown
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
