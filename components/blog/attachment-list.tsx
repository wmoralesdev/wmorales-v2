import Link from "next/link";
import { FaFile, FaFilePdf, FaFilePowerpoint, FaGithub } from "react-icons/fa6";
import type { PostAttachment } from "@/lib/blog";

type AttachmentListProps = {
  attachments: PostAttachment[];
};

function getAttachmentIcon(type?: string) {
  switch (type) {
    case "pdf":
      return FaFilePdf;
    case "repo":
      return FaGithub;
    case "slides":
      return FaFilePowerpoint;
    default:
      return FaFile;
  }
}

function getAttachmentLabel(type?: string) {
  switch (type) {
    case "pdf":
      return "PDF";
    case "repo":
      return "Repository";
    case "slides":
      return "Slides";
    default:
      return "File";
  }
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 border-border/60 border-t pt-8">
      <h3 className="font-display font-medium text-foreground text-sm">
        Attachments
      </h3>
      <ul className="space-y-2">
        {attachments.map((attachment, index) => {
          const Icon = getAttachmentIcon(attachment.type);
          const label = getAttachmentLabel(attachment.type);

          return (
            <li key={index}>
              <Link
                aria-label={`Open ${attachment.title} (${label})`}
                className="group flex items-center gap-3 rounded-md border border-border/50 bg-muted/30 p-3 transition-colors hover:border-accent/50 hover:bg-muted/50"
                href={attachment.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-5 w-5 shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground group-hover:text-accent">
                    {attachment.title}
                  </div>
                  {attachment.type && (
                    <div className="font-mono text-xs text-muted-foreground">
                      {label}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
