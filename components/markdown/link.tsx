import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
};

export function LinkComponent({ href, children, showIcon = true }: LinkProps) {
  const isExternal = href?.startsWith('http');
  const isHash = href?.startsWith('#');

  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1 text-purple-400 underline decoration-purple-400/30 underline-offset-2 transition-colors hover:text-purple-300 hover:decoration-purple-300/50',
        isHash && 'scroll-smooth'
      )}
      href={href}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    >
      {children}
      {isExternal && showIcon && <ArrowUpRight className="h-3 w-3 flex-shrink-0" />}
    </Link>
  );
}
