import { ArrowLeft01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";

type Props = {
  tone?: "paper" | "night";
  /** Home URL in the page's language. */
  home: string;
  /** Booking, or the way back home on the booking page itself. */
  action: { href: string; label: string; back?: boolean };
};

// Hero renders this from a client component, so it takes its copy as props.
export function SiteHeader({ tone = "paper", home, action }: Props) {
  const ink = tone === "night" ? "text-snow" : "text-ink";
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-7 ${ink}`}
    >
      <Link href={home} className="press group flex items-center gap-2.5">
        <span className="display grid size-9 place-items-center bg-ink text-[1.15rem] text-paper leading-none">
          WM
        </span>
        <span className="font-semibold text-small leading-tight">
          Walter Morales
          <span
            className={`block font-normal ${tone === "night" ? "text-night-soft" : "text-muted"}`}
          >
            AI Engineer
          </span>
        </span>
      </Link>
      <Link href={action.href} className="btn">
        <Icon icon={action.back ? ArrowLeft01Icon : Calendar03Icon} size={18} />
        {action.label}
      </Link>
    </header>
  );
}
