type PostBodyProps = {
  contentHtml: string;
};

export function PostBody({ contentHtml }: PostBodyProps) {
  return (
    <div
      className="prose-minimal"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
