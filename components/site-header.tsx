import { ArrowLeft01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";

type Props = {
  tone?: "paper" | "night";
  action?: { href: string; label: string };
};

export function SiteHeader({
  tone = "paper",
  action = { href: "/book", label: "Agendar llamada" },
}: Props) {
  const ink = tone === "night" ? "text-paper" : "text-ink";
  return (
    <header
      className={`relative z-20 flex items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-7 ${ink}`}
    >
      <Link href="/" className="press group flex items-center gap-2.5">
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
        <Icon
          icon={action.href === "/book" ? Calendar03Icon : ArrowLeft01Icon}
          size={18}
        />
        {action.label}
      </Link>
    </header>
  );
}
