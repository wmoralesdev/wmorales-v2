import { Terminal } from 'lucide-react';
import { BaseCard, type BaseCardProps } from './base-card';

interface TerminalCardProps extends Omit<BaseCardProps, 'children' | 'id'> { }

export function TerminalCard(props: TerminalCardProps) {
  return (
    <BaseCard className='border-gray-800 bg-black/90 p-3 font-mono backdrop-blur-xl lg:p-4' id="terminal" {...props}>
      <div className='mb-2 flex items-center gap-2 lg:mb-3'>
        <div className="flex gap-1.5">
          <div className='h-2.5 w-2.5 rounded-full bg-red-500 lg:h-3 lg:w-3' />
          <div className='h-2.5 w-2.5 rounded-full bg-yellow-500 lg:h-3 lg:w-3' />
          <div className='h-2.5 w-2.5 rounded-full bg-green-500 lg:h-3 lg:w-3' />
        </div>
        <Terminal className="h-3 w-3 text-gray-500" />
      </div>
      <div className='space-y-1 text-[10px] lg:text-xs'>
        <div className="text-green-400">$ git commit -m "feat: ship amazing products"</div>
        <div className="text-gray-400">[main 7a3b9c1] feat: ship amazing products</div>
        <div className="text-gray-400">∞ files changed, ∞ value created</div>
      </div>
    </BaseCard>
  );
}
