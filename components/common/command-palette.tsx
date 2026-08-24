"use client";

import { FileText, Home, Presentation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { PostMeta } from "@/lib/blog";
import type { DeckMeta } from "@/lib/slides";
import { icon } from "@/lib/stylex/icons";

type CommandPaletteProps = {
  posts: PostMeta[];
  decks: DeckMeta[];
};

const NAV_ROUTES: { href: string; labelKey: string; icon: typeof Home }[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/blog", labelKey: "blog", icon: FileText },
  { href: "/activities", labelKey: "activities", icon: FileText },
  { href: "/resources", labelKey: "resources", icon: FileText },
  { href: "/design-system", labelKey: "designSystem", icon: FileText },
  { href: "/slides", labelKey: "slides", icon: Presentation },
];

export function CommandPalette({ posts, decks }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("navigation");

  const handleSelect = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
    },
    [router],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      const isP = e.key.toLowerCase() === "p";
      if (!isMod || !e.shiftKey || !isP) return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable;

      if (isEditable) return;

      e.preventDefault();
      setOpen((prev) => !prev);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search and navigate to any route"
    >
      <CommandInput placeholder="Search routes..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ROUTES.map(({ href, labelKey, icon: Icon }) => (
            <CommandItem
              key={href}
              value={`${t(labelKey)} ${href}`}
              onSelect={() => handleSelect(href)}
            >
              <Icon {...stylex.props(icon.md)} />
              {t(labelKey)}
            </CommandItem>
          ))}
        </CommandGroup>

        {posts.length > 0 && (
          <CommandGroup heading="Blog">
            {posts.map((post) => (
              <CommandItem
                key={post.slug}
                value={`${post.title} /blog/${post.slug}`}
                onSelect={() => handleSelect(`/blog/${post.slug}`)}
              >
                <FileText {...stylex.props(icon.md)} />
                {post.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {decks.length > 0 && (
          <CommandGroup heading="Slides">
            {decks.flatMap((deck) => [
              <CommandItem
                key={`${deck.slug}-view`}
                value={`${deck.title} /slides/${deck.slug}`}
                onSelect={() => handleSelect(`/slides/${deck.slug}`)}
              >
                <Presentation {...stylex.props(icon.md)} />
                {deck.title}
              </CommandItem>,
              <CommandItem
                key={`${deck.slug}-print`}
                value={`${deck.title} print /slides/${deck.slug}/print`}
                onSelect={() => handleSelect(`/slides/${deck.slug}/print`)}
              >
                <Presentation {...stylex.props(icon.md)} />
                {deck.title} (Print)
              </CommandItem>,
            ])}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
