import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type SeparatorProps = {
  spacing?: 'small' | 'normal' | 'large';
};

export function SeparatorComponent({ spacing = 'normal' }: SeparatorProps) {
  const spacingClasses = {
    small: 'my-4',
    normal: 'my-8',
    large: 'my-12',
  };

  return <Separator className={cn('bg-gray-800', spacingClasses[spacing])} />;
}
