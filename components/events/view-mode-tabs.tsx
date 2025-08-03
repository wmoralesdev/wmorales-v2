'use client';

import { Calendar, Grid3x3, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ViewMode } from './types';

type ViewModeTabsProps = {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
  className?: string;
};

export function ViewModeTabs({
  value,
  onValueChange,
  className = '',
}: ViewModeTabsProps) {
  const t = useTranslations('events');

  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 p-1 rounded-none sm:rounded-lg">
        <TabsTrigger
          value="grid"
          className="data-[state=active]:bg-purple-500/20 text-xs sm:text-sm"
        >
          <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('gridView')}</span>
          <span className="sm:hidden">{t('grid')}</span>
        </TabsTrigger>
        <TabsTrigger
          value="slideshow"
          className="data-[state=active]:bg-purple-500/20 text-xs sm:text-sm"
        >
          <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('slideshow')}</span>
          <span className="sm:hidden">{t('slide')}</span>
        </TabsTrigger>
        <TabsTrigger
          value="timeline"
          className="data-[state=active]:bg-purple-500/20 text-xs sm:text-sm"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('timeline')}</span>
          <span className="sm:hidden">{t('time')}</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}