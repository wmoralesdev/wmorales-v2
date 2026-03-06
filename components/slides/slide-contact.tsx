import { Globe, Mail, Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ContactInfo {
  name?: string;
  email: string;
  website?: string;
  phone?: string;
}

interface SlideContactProps {
  contact: ContactInfo;
  className?: string;
  compact?: boolean;
}

/**
 * SlideContact renders contact information in a card format.
 * Used in CTA slides.
 */
export function SlideContact({
  contact,
  className,
  compact = false,
}: SlideContactProps) {
  return (
    <Card className={cn("border-border/60 bg-muted/20", className)}>
      <CardContent className={cn(compact ? "space-y-2.5 p-4" : "space-y-3 p-6")}>
        {contact.name && (
          <div className={cn("flex items-center", compact ? "gap-2.5" : "gap-3")}>
            <User className={cn("text-muted-foreground", compact ? "size-3.5" : "size-4")} />
            <span className={cn("text-foreground", compact ? "text-sm font-medium" : "font-medium")}>
              {contact.name}
            </span>
          </div>
        )}
        <div className={cn("flex items-center", compact ? "gap-2.5" : "gap-3")}>
          <Mail className={cn("text-muted-foreground", compact ? "size-3.5" : "size-4")} />
          <a
            href={`mailto:${contact.email}`}
            className={cn(
              "text-accent underline-offset-2 hover:underline",
              compact && "text-sm",
            )}
          >
            {contact.email}
          </a>
        </div>
        {contact.website && (
          <div className={cn("flex items-center", compact ? "gap-2.5" : "gap-3")}>
            <Globe className={cn("text-muted-foreground", compact ? "size-3.5" : "size-4")} />
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-accent underline-offset-2 hover:underline",
                compact && "text-sm",
              )}
            >
              {contact.website}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className={cn("flex items-center", compact ? "gap-2.5" : "gap-3")}>
            <Phone className={cn("text-muted-foreground", compact ? "size-3.5" : "size-4")} />
            <a
              href={`tel:${contact.phone}`}
              className={cn(
                "text-accent underline-offset-2 hover:underline",
                compact && "text-sm",
              )}
            >
              {contact.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
