import { cn } from "@/lib/utils";

interface CredentialGroup {
  category: string;
  items: string[];
}

interface SlideCredentialsProps {
  credentials: CredentialGroup[];
  className?: string;
}

/**
 * SlideCredentials renders credential groups in a grid layout.
 * Used in Profile slides. Max 3 groups recommended.
 */
export function SlideCredentials({
  credentials,
  className,
}: SlideCredentialsProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        credentials.length === 1 && "grid-cols-1",
        credentials.length === 2 && "grid-cols-2",
        credentials.length >= 3 && "grid-cols-3",
        className,
      )}
    >
      {credentials.map((group) => (
        <div key={group.category} className="space-y-3">
          <div className="space-y-1">
            <div className="h-0.5 w-6 bg-accent" />
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-accent">
              {group.category}
            </h4>
          </div>
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent/50" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
