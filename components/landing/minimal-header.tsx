import { getTranslations } from "next-intl/server";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { NavLink } from "@/components/common/nav-link";
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
        <h1 className="font-display font-semibold text-4xl text-foreground text-balance sm:text-5xl">
          {t("name")} <span className="text-accent">{t("nameAccent")}</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t("role")}
          <br />
          <span className="text-muted-foreground/80">{t("location")}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 animate-pulse rounded-full bg-accent" />
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
            <Icon className="size-[18px]" />
          </a>
        ))}
        <span className="h-3.5 w-px bg-border" />
        <NavLink href="/" exact>
          {tNav("home")}
        </NavLink>
        <NavLink href="/blog">{tNav("blog")}</NavLink>
        <NavLink href="/design-system">{tNav("designSystem")}</NavLink>
        <span className="h-3.5 w-px bg-border" />
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </header>
  );
}
