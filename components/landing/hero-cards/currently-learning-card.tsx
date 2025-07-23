import { Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BaseCard, type BaseCardProps } from './base-card';

type CurrentlyLearningCardProps = Omit<BaseCardProps, 'children' | 'id'>;

export function CurrentlyLearningCard(props: CurrentlyLearningCardProps) {
  return (
    <BaseCard className="border-gray-800 bg-gray-900/80 p-4 backdrop-blur-xl lg:p-6" id="currently-learning" {...props}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400 lg:h-6 lg:w-6" />
          <span className="font-medium text-white text-xs lg:text-sm">Currently Learning</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/10" variant="outline">
            LLMs
          </Badge>
          <Badge className="border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/10" variant="outline">
            AI
          </Badge>
          <Badge className="border-purple-500/30 text-purple-300 text-xs hover:bg-purple-500/10" variant="outline">
            Web3
          </Badge>
        </div>
        <p className="text-gray-500 text-xs">Always exploring new technologies</p>
      </div>
    </BaseCard>
  );
}
