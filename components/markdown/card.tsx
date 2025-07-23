import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type CardProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  variant?: 'default' | 'feature' | 'warning' | 'success';
  icon?: React.ReactNode;
};

export function CardComponent({ children, title, description, variant = 'default', icon }: CardProps) {
  const variants = {
    default: 'border-gray-800 bg-gray-900/50',
    feature: 'border-purple-500/30 bg-purple-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    success: 'border-green-500/30 bg-green-500/5',
  };

  return (
    <Card className={cn('my-6', variants[variant])}>
      {(title || description) && (
        <CardHeader>
          {title && (
            <CardTitle className="flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
          )}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(!(title || description) && 'pt-6')}>{children}</CardContent>
    </Card>
  );
}
