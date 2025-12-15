import Link from "next/link";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { ThemeToggle } from "@/components/common/theme-toggle";

const socialLinks = [
  { href: "https://github.com/wmoralesdev", icon: FaGithub, label: "GitHub" },
  { href: "https://linkedin.com/in/wmoralesdev", icon: FaLinkedin, label: "LinkedIn" },
  { href: "https://x.com/wmoralesdev", icon: FaXTwitter, label: "X" },
];

export function MinimalHeader() {
  return (
    <header className="space-y-6">
      <div className="space-y-4">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Walter <span className="text-accent">Morales</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Software Engineer building products with modern web technologies.
          <br />
          <span className="text-muted-foreground/80">
            Based in El Salvador.
          </span>
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-sm font-medium text-accent">
            Cursor Ambassador for El Salvador
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-5">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/70 transition-colors hover:text-foreground"
            aria-label={label}
          >
            <Icon className="h-[18px] w-[18px]" />
          </a>
        ))}
        <span className="h-3.5 w-px bg-border" />
        <Link
          href="/blog"
          className="text-sm text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          Blog
        </Link>
        <span className="h-3.5 w-px bg-border" />
        <ThemeToggle />
      </nav>
    </header>
  );
}
