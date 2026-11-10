import { ArrowLeft01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";

type Props = {
  /** "accent" is for the cover, where the header sits on the accent field. */
  tone?: "paper" | "night" | "accent";
  /** Home URL in the page's language. */
  home: string;
  /** Booking, or the way back home on the booking page itself. */
  action: { href: string; label: string; back?: boolean };
};

// Hero renders this from a client component, so it takes its copy as props.
export function SiteHeader({ tone = "paper", home, action }: Props) {
  const ink = tone === "paper" ? "text-ink" : "text-snow";
  const soft =
    tone === "night"
      ? "text-night-soft"
      : tone === "accent"
        ? "text-snow/80"
        : "text-muted";
  // Accent on accent would vanish: on the cover the button prints in snow.
  const button =
    tone === "accent"
      ? "btn [--btn-bg:var(--color-snow)] [--btn-fg:var(--color-night)] [--btn-bg-hover:var(--color-night)] [--btn-fg-hover:var(--color-snow)]"
      : "btn";
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-7 ${ink}`}
    >
      <Link
        href={home}
        className="press group flex min-h-11 items-center gap-2.5"
      >
        <span className="display grid size-9 place-items-center bg-ink text-[1.15rem] text-paper leading-none">
          WM
        </span>
        <span className="font-semibold text-small leading-tight">
          Walter Morales
          <span className={`block font-normal ${soft}`}>AI Engineer</span>
        </span>
      </Link>
      <Link href={action.href} className={button}>
        <Icon icon={action.back ? ArrowLeft01Icon : Calendar03Icon} size={18} />
        {action.label}
      </Link>
    </header>
  );
}
