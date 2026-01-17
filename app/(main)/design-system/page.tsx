import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MinimalHeader } from "@/components/landing/minimal-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("designSystem.metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DesignSystemPage() {
  const t = await getTranslations("designSystem");
  return (
    <div className="space-y-16">
      <MinimalHeader />

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
          {t("overview.title")}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-pretty">
              {t("overview.description")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
            {t("typography.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {t("typography.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("typography.scale.title")}</CardTitle>
            <CardDescription>
              {t("typography.scale.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("typography.scale.pageTitle.name")}
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-3xl sm:text-4xl
                  </code>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">
                  {t.rich("typography.scale.pageTitle.description", {
                    code: (chunks) => (
                      <code className="font-mono text-xs">{chunks}</code>
                    ),
                  })}
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {t("typography.scale.pageTitle.example")}
                  </h1>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("typography.scale.sectionTitle.name")}
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-xl
                  </code>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">
                  {t("typography.scale.sectionTitle.description")}
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
                    {t("typography.scale.sectionTitle.example")}
                  </h2>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("typography.scale.bodyText.name")}
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-sm
                  </code>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">
                  {t.rich("typography.scale.bodyText.description", {
                    code: (chunks) => (
                      <code className="font-mono text-xs">{chunks}</code>
                    ),
                  })}
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t("typography.scale.bodyText.example")}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("typography.scale.metaText.name")}
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-xs font-mono
                  </code>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">
                  {t.rich("typography.scale.metaText.description", {
                    code: (chunks) => (
                      <code className="font-mono text-xs">{chunks}</code>
                    ),
                  })}
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <time className="font-mono text-xs text-muted-foreground">
                    {t("typography.scale.metaText.exampleDate")}
                  </time>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {t("typography.scale.metaText.exampleTag")}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {t("typography.scale.smallHeading.name")}
                  </h3>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                    text-base font-display
                  </code>
                </div>
                <p className="text-sm text-muted-foreground text-pretty">
                  {t.rich("typography.scale.smallHeading.description", {
                    code: (chunks) => (
                      <code className="font-mono text-xs">{chunks}</code>
                    ),
                  })}
                </p>
                <div className="border-l-2 border-accent/50 pl-4">
                  <h3 className="font-display text-base font-medium text-foreground">
                    {t("typography.scale.smallHeading.example")}
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
              <CardTitle className="text-green-500">
                {t("typography.dosAndDonts.do.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("typography.dosAndDonts.do.useCanonical.title")}
                </p>
                <code className="mt-1 block rounded bg-muted p-2 font-mono text-xs">
                  {t("typography.dosAndDonts.do.useCanonical.classes")}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("typography.dosAndDonts.do.maintainConsistency.title")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {t(
                    "typography.dosAndDonts.do.maintainConsistency.description",
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">
                {t("typography.dosAndDonts.dont.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("typography.dosAndDonts.dont.avoidArbitrary.title")}
                </p>
                <code className="mt-1 block rounded bg-muted p-2 font-mono text-xs text-red-500">
                  {t("typography.dosAndDonts.dont.avoidArbitrary.classes")}
                </code>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t("typography.dosAndDonts.dont.dontMix.title")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  {t("typography.dosAndDonts.dont.dontMix.description")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
            {t("colors.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {t("colors.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("colors.palette.title")}</CardTitle>
            <CardDescription>{t("colors.palette.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.accent.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-accent
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.accent.description")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.foreground.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      text-foreground
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.foreground.description")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-muted" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.muted.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-muted
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.muted.description")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-border" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.border.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      border-border
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.border.description")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.mutedForeground.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      text-muted-foreground
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.mutedForeground.description")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded border border-border bg-background" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {t("colors.palette.background.name")}
                    </p>
                    <code className="font-mono text-xs text-muted-foreground">
                      bg-background
                    </code>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-pretty">
                  {t("colors.palette.background.description")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
            {t("spacing.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {t("spacing.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("spacing.scale.title")}</CardTitle>
            <CardDescription>{t("spacing.scale.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">
                  {t("spacing.scale.commonValues")}
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
              <CardTitle className="text-green-500">
                {t("spacing.dosAndDonts.do.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-pretty">
                {t.rich("spacing.dosAndDonts.do.description", {
                  code: (chunks) => (
                    <code className="font-mono text-xs">{chunks}</code>
                  ),
                })}
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">
                {t("spacing.dosAndDonts.dont.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-pretty">
                {t.rich("spacing.dosAndDonts.dont.description", {
                  code: (chunks) => (
                    <code className="font-mono text-xs">{chunks}</code>
                  ),
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-balance text-foreground">
            {t("components.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            {t("components.description")}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("components.button.title")}</CardTitle>
            <CardDescription>
              {t("components.button.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>{t("components.button.variants.default")}</Button>
              <Button variant="outline">
                {t("components.button.variants.outline")}
              </Button>
              <Button variant="ghost">
                {t("components.button.variants.ghost")}
              </Button>
              <Button variant="link">
                {t("components.button.variants.link")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("components.badge.title")}</CardTitle>
            <CardDescription>
              {t("components.badge.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>{t("components.badge.variants.default")}</Badge>
              <Badge variant="outline">
                {t("components.badge.variants.outline")}
              </Badge>
              <Badge variant="secondary">
                {t("components.badge.variants.secondary")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
