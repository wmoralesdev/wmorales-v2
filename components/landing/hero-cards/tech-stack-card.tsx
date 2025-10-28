import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { BaseCard, type BaseCardProps } from "./base-card";

type TechStackCardProps = Omit<BaseCardProps, "children" | "id">;

export function TechStackCard(props: TechStackCardProps) {
  return (
    <BaseCard
      className="border-gray-800 bg-black/80 p-4 backdrop-blur-xl lg:p-6"
      id="tech-stack"
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-purple-400 lg:h-6 lg:w-6" />
          <span className="font-medium text-white text-xs lg:text-sm">
            Tech Stack
          </span>
        </div>
        <div className="relative flex h-24 items-center justify-center lg:h-32">
          <div className="grid grid-cols-2 gap-2 text-xs lg:gap-3">
            <div className="space-y-1 text-right">
              <div className="text-purple-300">Frontend</div>
              <div className="text-[10px] text-gray-500 lg:text-xs">
                React • Next.js
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-purple-300">Backend</div>
              <div className="text-[10px] text-gray-500 lg:text-xs">
                .NET • Node.js
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-purple-300">Database</div>
              <div className="text-[10px] text-gray-500 lg:text-xs">
                PostgreSQL • MongoDB
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-purple-300">Cloud</div>
              <div className="text-[10px] text-gray-500 lg:text-xs">
                AWS • Azure
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              className="h-16 w-16 rounded-full border-2 border-purple-500/20 border-dashed lg:h-20 lg:w-20"
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
