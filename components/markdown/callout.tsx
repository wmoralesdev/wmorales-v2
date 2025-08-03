'use client';

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type CalloutProps = {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip';
  title?: string;
  children: React.ReactNode;
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const configs = {
    info: {
      icon: Info,
      className: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
      iconClassName: 'text-blue-400',
    },
    warning: {
      icon: AlertTriangle,
      className: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
      iconClassName: 'text-yellow-400',
    },
    error: {
      icon: AlertCircle,
      className: 'border-red-500/30 bg-red-500/5 text-red-400',
      iconClassName: 'text-red-400',
    },
    success: {
      icon: CheckCircle,
      className: 'border-green-500/30 bg-green-500/5 text-green-400',
      iconClassName: 'text-green-400',
    },
    tip: {
      icon: Info,
      className: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
      iconClassName: 'text-purple-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Alert className={cn('my-6', config.className)}>
      <Icon className={cn('h-4 w-4', config.iconClassName)} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="mt-2 text-gray-300">
        {children}
      </AlertDescription>
    </Alert>
  );
}
