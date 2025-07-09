import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaseCard, type BaseCardProps } from './base-card';

interface CursorAmbassadorCardProps extends Omit<BaseCardProps, 'children' | 'id'> { }

export function CursorAmbassadorCard(props: CursorAmbassadorCardProps) {
  return (
    <BaseCard
      className='border-purple-800/50 bg-gradient-to-br from-purple-900/40 to-gray-900/40 p-4 backdrop-blur-xl lg:p-6'
      id="cursor-ambassador"
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Award className='h-6 w-6 text-purple-400 lg:h-8 lg:w-8' />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              className='absolute inset-0 rounded-full bg-purple-400/20 blur-xl'
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </div>
          <Badge className='border-green-500/30 bg-green-500/20 text-green-400 text-xs'>Active</Badge>
        </div>
        <div>
          <h3 className='font-semibold text-sm text-white lg:text-base'>Cursor Ambassador</h3>
          <p className='mt-1 text-gray-400 text-xs lg:text-sm'>Empowering developers with AI</p>
        </div>
      </div>
    </BaseCard>
  );
}
