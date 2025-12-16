"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  exact?: boolean;
};

export function NavLink({
  href,
  children,
  className,
  exact = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors",
        isActive ? "text-accent" : "text-muted-foreground hover:text-accent",
        className,
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 h-px w-full bg-accent" />
      )}
    </Link>
  );
}
