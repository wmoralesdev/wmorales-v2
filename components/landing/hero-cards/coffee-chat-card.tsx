import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BaseCard, type BaseCardProps } from './base-card';

type CoffeeChatCardProps = Omit<BaseCardProps, 'children' | 'id'> & {
  onChatClick?: () => void;
};

export function CoffeeChatCard({ onChatClick, ...props }: CoffeeChatCardProps) {
  return (
    <BaseCard
      className="border-purple-700/50 bg-gradient-to-r from-purple-900/30 to-purple-800/30 p-4 backdrop-blur-xl"
      id="coffee-chat"
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            <Coffee className="h-6 w-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm text-white">Let's grab a coffee!</h3>
            <p className="text-gray-400 text-xs">Best ideas start with a conversation</p>
          </div>
        </div>
        <Button
          className="border-purple-500/50 text-purple-300 text-xs hover:bg-purple-500/20"
          onClick={onChatClick}
          size="sm"
          variant="outline"
        >
          Chat
        </Button>
      </div>
    </BaseCard>
  );
}
