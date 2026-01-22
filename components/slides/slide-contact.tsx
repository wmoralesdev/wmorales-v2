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
}

/**
 * SlideContact renders contact information in a card format.
 * Used in CTA slides.
 */
export function SlideContact({ contact, className }: SlideContactProps) {
  return (
    <Card className={cn("border-border/60 bg-muted/20", className)}>
      <CardContent className="space-y-3 p-6">
        {contact.name && (
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground" />
            <span className="font-medium text-foreground">{contact.name}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Mail className="size-4 text-muted-foreground" />
          <a
            href={`mailto:${contact.email}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            {contact.email}
          </a>
        </div>
        {contact.website && (
          <div className="flex items-center gap-3">
            <Globe className="size-4 text-muted-foreground" />
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline-offset-2 hover:underline"
            >
              {contact.website}
            </a>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-3">
            <Phone className="size-4 text-muted-foreground" />
            <a
              href={`tel:${contact.phone}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              {contact.phone}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
