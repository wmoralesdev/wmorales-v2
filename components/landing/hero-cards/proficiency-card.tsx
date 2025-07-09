import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { BaseCard, type BaseCardProps } from './base-card';

interface ProficiencyCardProps extends Omit<BaseCardProps, 'children' | 'id'> { }

const proficiencyData = [
  { name: '.NET', level: 90 },
  { name: 'React/Next.js', level: 85 },
  { name: 'Cloud (AWS/Azure)', level: 80 },
  { name: 'Databases', level: 85 },
];

export function ProficiencyCard(props: ProficiencyCardProps) {
  return (
    <BaseCard className='border-gray-800 bg-gray-900/80 p-4 backdrop-blur-xl lg:p-6' id="proficiency" {...props}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className='h-5 w-5 text-purple-400 lg:h-6 lg:w-6' />
          <span className='font-medium text-white text-xs lg:text-sm'>Proficiency</span>
        </div>
        <div className="space-y-2 lg:space-y-3">
          {proficiencyData.map((skill, index) => (
            <div className="space-y-1" key={skill.name}>
              <div className="flex justify-between text-[10px] lg:text-xs">
                <span className="text-gray-400">{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className='h-1 overflow-hidden rounded-full bg-gray-800 lg:h-1.5'>
                <motion.div
                  animate={{ width: `${skill.level}%` }}
                  className='h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400'
                  initial={{ width: 0 }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}
