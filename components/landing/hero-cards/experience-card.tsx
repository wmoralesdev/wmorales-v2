import { BaseCard, type BaseCardProps } from './base-card';
import { useTranslations } from 'next-intl';

type ExperienceCardProps = Omit<
  BaseCardProps,
  'children' | 'id' | 'animateFloat'
>;

const START_YEAR = 2020;

export function ExperienceCard(props: ExperienceCardProps) {
  const t = useTranslations('homepage.cards');
  const years = Math.abs(new Date().getFullYear() - START_YEAR);

  return (
    <BaseCard
      animateFloat={true}
      className="border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-purple-600/20 px-5 py-3 text-center backdrop-blur-xl"
      id="experience"
      {...props}
    >
      <span className="font-medium text-base text-purple-300 lg:text-lg">
        {years}+ {t('experience')}
      </span>
    </BaseCard>
  );
}
