import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SlideCardItem {
  title: string;
  subtitle?: string;
  description?: string;
  items?: string[];
}

interface SlideCardGridProps {
  cards: SlideCardItem[];
  className?: string;
}

/**
 * SlideCardGrid renders a grid of content cards.
 * 2 cards: 50/50 split
 * 3 cards: 33/33/33 split
 * 4 cards: 2x2 grid or 25% each
 */
export function SlideCardGrid({ cards, className }: SlideCardGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        cards.length === 2 && "grid-cols-2",
        cards.length === 3 && "grid-cols-3",
        cards.length >= 4 && "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          className="border-border/60 bg-muted/20 transition-colors hover:border-accent/40"
        >
          {/* Accent top border */}
          <div className="h-1 rounded-t-lg bg-accent/60" />
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg font-semibold text-foreground">
              {card.title}
            </CardTitle>
            {card.subtitle && (
              <span className="inline-block w-fit rounded-full bg-accent/20 px-3 py-0.5 text-xs font-medium text-accent">
                {card.subtitle}
              </span>
            )}
          </CardHeader>
          <CardContent>
            {card.description && (
              <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                {card.description}
              </p>
            )}
            {card.items && card.items.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
