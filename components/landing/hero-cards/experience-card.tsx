import { BaseCard, type BaseCardProps } from './base-card';

interface ExperienceCardProps extends Omit<BaseCardProps, 'children' | 'id' | 'animateFloat'> { }

export function ExperienceCard(props: ExperienceCardProps) {
  return (
    <BaseCard
      animateFloat={true}
      className='border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-purple-600/20 px-5 py-3 text-center backdrop-blur-xl'
      id="experience"
      {...props}
    >
      <span className='font-medium text-base text-purple-300 lg:text-lg'>5+ Years Experience</span>
    </BaseCard>
  );
}
