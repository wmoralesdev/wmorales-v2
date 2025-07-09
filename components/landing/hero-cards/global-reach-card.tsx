import { Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaseCard, type BaseCardProps } from './base-card';

interface GlobalReachCardProps extends Omit<BaseCardProps, 'children' | 'id'> { }

export function GlobalReachCard(props: GlobalReachCardProps) {
  return (
    <BaseCard className='border-gray-800 bg-gray-900/80 p-4 backdrop-blur-xl lg:p-6' id="global-reach" {...props}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Globe className='h-6 w-6 text-purple-400 lg:h-8 lg:w-8' />
          <Badge className='border-purple-500/30 bg-purple-500/20 text-purple-400 text-xs'>Global</Badge>
        </div>
        <div>
          <div className='font-bold text-2xl text-white lg:text-3xl'>10+</div>
          <p className='text-gray-400 text-xs lg:text-sm'>Countries</p>
          <p className='mt-1 text-gray-500 text-xs'>Clients from around the world</p>
        </div>
      </div>
    </BaseCard>
  );
}
