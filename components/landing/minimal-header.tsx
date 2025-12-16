import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";

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
    <header className="space-y-6">
      <div className="space-y-4">
        <h1 className="font-display font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
          {t("name")} <span className="text-accent">{t("nameAccent")}</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t("role")}
          <br />
          <span className="text-muted-foreground/80">{t("location")}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-medium font-mono text-accent text-sm">
            {t("ambassador")}
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-5">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            aria-label={label}
            className="text-muted-foreground/70 transition-colors hover:text-foreground"
            href={href}
            key={label}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        ))}
        <span className="h-3.5 w-px bg-border" />
        <Link
          className="link-underline text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          href="/blog"
        >
          {tNav("blog")}
        </Link>
        <Link
          className="link-underline text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          href="/design-system"
        >
          {tNav("designSystem")}
        </Link>
        <span className="h-3.5 w-px bg-border" />
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </header>
  );
}
