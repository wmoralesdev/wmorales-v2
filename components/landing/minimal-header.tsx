import Link from "next/link";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LanguageSwitcher } from "@/components/common/language-switcher";

const socialLinks = [
  { href: "https://github.com/wmoralesdev", icon: FaGithub, label: "GitHub" },
  {
    href: "https://linkedin.com/in/wmoralesdev",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  { href: "https://x.com/wmoralesdev", icon: FaXTwitter, label: "X" },
];

export function MinimalHeader() {
  return (
    <header className="space-y-6">
      <div className="space-y-4">
        <h1 className="font-display font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
          Walter <span className="text-accent">Morales</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Software Engineer building products with modern web technologies.
          <br />
          <span className="text-muted-foreground/80">
            Based in El Salvador.
          </span>
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="font-medium font-mono text-accent text-sm">
            Cursor Ambassador for El Salvador
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
          className="text-muted-foreground/70 text-sm transition-colors hover:text-foreground"
          href="/blog"
        >
          Blog
        </Link>
        <Link
          className="text-muted-foreground/70 text-sm transition-colors hover:text-foreground"
          href="/design-system"
        >
          Design System
        </Link>
        <span className="h-3.5 w-px bg-border" />
        <LanguageSwitcher />
        <ThemeToggle />
      </nav>
    </header>
  );
}
