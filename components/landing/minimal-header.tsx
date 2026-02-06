import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import { ElSalvadorTime } from "@/components/common/el-salvador-time";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { NavLink } from "@/components/common/nav-link";
import { NavRail } from "@/components/common/nav-rail";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const socialLinks = [
  { href: "https://github.com/wmoralesdev", icon: FaGithub, label: "GitHub" },
  {
    href: "https://linkedin.com/in/wmoralesdev",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  { href: "https://x.com/wmoralesdev", icon: FaXTwitter, label: "X" },
];

export async function MinimalHeader() {
  const t = await getTranslations("homepage.header");
  const tNav = await getTranslations("navigation");

  return (
    <header className="space-y-8">
      {/* Top Section: Profile & Intro */}
      <div className="flex flex-col-reverse gap-6 md:flex-row md:items-start md:justify-between">
        {/* Text Content */}
        <div className="space-y-4 md:max-w-[65%]">
          <h1 className="font-display font-semibold text-4xl text-foreground text-balance sm:text-5xl">
            {t("name")} <span className="text-accent">{t("nameAccent")}</span>
          </h1>
          
          <div className="space-y-3">
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
              {t("role")}
            </p>
            <div className="flex items-center gap-2 font-mono text-muted-foreground/80 text-sm">
              <span>{t("location")}</span>
              <span className="text-muted-foreground/40" aria-hidden="true">•</span>
              <ElSalvadorTime />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <Badge
              variant="outline"
              className="shrink-0 gap-1.5 border-accent/30 bg-accent/10 py-1 pl-1 pr-2.5 font-normal text-foreground dark:border-accent/40 dark:bg-accent/15"
            >
              <div className="flex size-5 items-center justify-center rounded-full bg-foreground/10 dark:bg-foreground/15">
                <Image
                  src="/cube-2d-light.svg"
                  width={14}
                  height={14}
                  alt="Cursor"
                  className="dark:hidden"
                />
                <Image
                  src="/cube-2d-dark.svg"
                  width={14}
                  height={14}
                  alt="Cursor"
                  className="hidden dark:block"
                />
              </div>
              <span>{t("ambassador")}</span>
            </Badge>

            <div className="flex shrink-0 items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  aria-label={label}
                  className="text-muted-foreground/70 transition-all duration-200 hover:text-foreground hover:-translate-y-0.5"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>

            <span className="h-3.5 w-px shrink-0 bg-border" aria-hidden="true" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Avatar */}
        <div className="self-start">
          <Avatar className="size-24 rounded-2xl transition-transform duration-200 hover:-rotate-2 hover:scale-105 md:size-32">
            <AvatarImage src="/me.jpeg" alt="Walter Morales" className="object-cover" />
            <AvatarFallback>WM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center gap-6">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          {/* Mobile: allow wrapping; simple active background */}
          <div className="flex flex-wrap items-center gap-2 md:hidden">
            <NavLink href="/" exact>
              {tNav("home")}
            </NavLink>
            <NavLink href="/blog">{tNav("blog")}</NavLink>
            <NavLink href="/activities">{tNav("activities")}</NavLink>
            <NavLink href="/resources">{tNav("resources")}</NavLink>
            <NavLink href="/design-system">{tNav("designSystem")}</NavLink>
          </div>

          {/* Desktop: shared sliding indicator (equal-width cells) */}
          <div className="hidden w-full md:block">
            <NavRail
              className="w-full"
              items={[
                { href: "/", label: tNav("home"), exact: true },
                { href: "/blog", label: tNav("blog") },
                { href: "/activities", label: tNav("activities") },
                { href: "/resources", label: tNav("resources") },
                { href: "/design-system", label: tNav("designSystem") },
              ]}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
