import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Design System | Walter Morales",
  description: "Design system and UI guidelines for the portfolio website.",
};

export default async function DesignSystemPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <Link
          href="/"
          className="inline-block font-mono text-xs text-accent transition-colors hover:text-accent/80"
        >
          ← Home
        </Link>
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Design System
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guidelines and patterns for building consistent UI components.
          </p>
        </div>
      </header>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              This design system establishes the foundation for building
              consistent, accessible, and maintainable UI components. It defines
              typography scales, color palettes, spacing systems, and component
              patterns used throughout the site.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Typography
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Consistent typography creates hierarchy and improves readability.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Typography Scale</CardTitle>
            <CardDescription>
              Use these canonical classes instead of arbitrary pixel values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Page Title
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-3xl sm:text-4xl
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Main page headings. Use with{" "}
                  <code className="font-mono text-xs">font-display</code>.
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Example Page Title
                  </h1>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Section Title
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-xl
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Section headings within pages.
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                    Section Title
                  </h2>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Body Text
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-sm
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Default body text, summaries, and descriptions. Replaces{" "}
                  <code className="font-mono text-xs">text-[13px]</code>.
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is body text used for summaries, descriptions, and
                    general content. It provides good readability while
                    maintaining a clean, minimal aesthetic.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Meta Text
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-xs font-mono
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dates, tags, labels, and small metadata. Replaces{" "}
                  <code className="font-mono text-xs">text-[11px]</code>.
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <time className="font-mono text-xs text-muted-foreground">
                    January 15, 2025
                  </time>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      #tag
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Small Heading
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-base font-display
                  </code>
                </div>
                <p className="text-sm text-muted-foreground">
                  Small headings, card titles, and list item titles. Replaces{" "}
                  <code className="font-mono text-xs">text-[15px]</code>.
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h3 className="font-display text-base font-medium text-foreground">
                    Small Heading Example
                  </h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Do's and Don'ts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-500">Do</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Use canonical classes:
                </p>
                <code className="mt-1 block rounded bg-muted p-2 font-mono text-xs">
                  text-xs font-mono
                  <br />
                  text-sm
                  <br />
                  text-base font-display
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Maintain consistency:
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the same typography classes for the same semantic purpose
                  across all pages.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Don&apos;t</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Avoid arbitrary sizes:
                </p>
                <code className="mt-1 block rounded bg-muted p-2 font-mono text-xs text-red-500">
                  text-[11px]
                  <br />
                  text-[13px]
                  <br />
                  text-[15px]
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Don&apos;t mix patterns:
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Avoid using different font sizes for the same semantic role in
                  different components.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Colors
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Semantic color tokens for consistent theming.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Use semantic color names, not raw color values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Accent
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-accent
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Primary actions, links, highlights, and interactive elements.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Foreground
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      text-foreground
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Primary text color, headings, and high-contrast elements.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Muted</p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-muted
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Backgrounds for cards, code blocks, and subtle UI elements.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-border" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Border
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      border-border
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Borders, dividers, and subtle separators.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Muted Foreground
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      text-muted-foreground
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Secondary text, descriptions, and less prominent content.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded border border-border bg-background" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Background
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-background
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Main page background color.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Spacing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Consistent spacing creates visual rhythm and hierarchy.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
            <CardDescription>
              Use Tailwind&apos;s spacing scale for consistent gaps and padding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  Common Spacing Values
                </p>
                <div className="space-y-2">
                  {[2, 3, 4, 6, 8, 12, 16].map((size) => (
                    <div key={size} className="flex items-center gap-4">
                      <div className="w-16">
                        <code className="font-mono text-xs text-muted-foreground">
                          {size * 4}px
                        </code>
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-4 bg-accent"
                          style={{ width: `${size * 4}px` }}
                        />
                      </div>
                      <code className="font-mono text-xs text-muted-foreground">
                        gap-{size} | p-{size} | space-y-{size}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-500">Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use consistent spacing tokens like{" "}
                <code className="font-mono text-xs">space-y-4</code>,{" "}
                <code className="font-mono text-xs">gap-6</code>, and{" "}
                <code className="font-mono text-xs">p-8</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Don&apos;t</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Avoid arbitrary spacing values like{" "}
                <code className="font-mono text-xs">gap-[13px]</code> or{" "}
                <code className="font-mono text-xs">p-[17px]</code>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Components
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Reusable UI components built with shadcn/ui and Tailwind CSS.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Button</CardTitle>
            <CardDescription>
              Use Button component for all interactive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge</CardTitle>
            <CardDescription>
              Use Badge for tags, labels, and status indicators.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="secondary">Secondary</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
