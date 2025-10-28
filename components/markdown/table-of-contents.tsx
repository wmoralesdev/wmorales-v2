import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TableOfContentsProps = {
  headings: Array<{
    id: string;
    title: string;
    level: number;
  }>;
};

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <Card className="my-6 border-gray-800 bg-gray-900/50">
      <CardHeader>
        <CardTitle className="text-lg">Table of Contents</CardTitle>
      </CardHeader>
      <CardContent>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                className={cn("text-sm", heading.level > 2 && "ml-4")}
                key={heading.id}
              >
                <Link
                  className="text-gray-400 transition-colors hover:text-white"
                  href={`#${heading.id}`}
                >
                  {heading.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}
