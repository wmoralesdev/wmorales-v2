import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { BaseCard, type BaseCardProps } from "./base-card";

// Constants
const ANIMATION_DURATION_LONG = 1;
const ANIMATION_BASE_DELAY = 0.5;
const ANIMATION_DELAY_INCREMENT = 0.1;

type ProficiencyCardProps = Omit<BaseCardProps, "children" | "id">;

const proficiencyData = [
  { name: ".NET", level: 90 },
  { name: "React/Next.js", level: 85 },
  { name: "NestJS/Express", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Python", level: 70 },
  { name: "Cloud (AWS/Azure)", level: 80 },
  { name: "Databases", level: 85 },
  { name: "AI", level: 80 },
  { name: "LLMs", level: 75 },
];

export function ProficiencyCard(props: ProficiencyCardProps) {
  const t = useTranslations("homepage.cards");

  return (
    <BaseCard
      className="border-gray-800 bg-gray-900/80 p-4 backdrop-blur-xl lg:p-6"
      id="proficiency"
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-400 lg:h-6 lg:w-6" />
          <span className="font-medium text-white text-xs lg:text-sm">
            {t("proficiency")}
          </span>
        </div>
        <div className="space-y-2 lg:space-y-3">
          {proficiencyData.map((skill, index) => (
            <div className="space-y-1" key={skill.name}>
              <div className="flex justify-between text-[10px] lg:text-xs">
                <span className="text-gray-400">{skill.name}</span>
                <span className="text-gray-500">{skill.level}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gray-800 lg:h-1.5">
                <motion.div
                  animate={{ width: `${skill.level}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                  initial={{ width: 0 }}
                  transition={{
                    duration: ANIMATION_DURATION_LONG,
                    delay:
                      ANIMATION_BASE_DELAY + index * ANIMATION_DELAY_INCREMENT,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
}
