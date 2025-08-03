import { motion, type Variants } from 'framer-motion';

type AnimatedLogoProps = React.ComponentProps<typeof motion.svg> & {
  strokeWidth?: number;
  topColor?: string;
  bottomColor?: string;
};

export function AnimatedLogo({
  strokeWidth = 250,
  topColor = 'white',
  bottomColor = '#7C3AED',
  ...props
}: AnimatedLogoProps) {
  const svgVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const pathVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.svg
      animate="visible"
      aria-label="Logo"
      fill="none"
      height="100%"
      initial="hidden"
      role="img"
      variants={svgVariants}
      viewBox="0 0 2290 2284"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top */}
      <motion.path
        d="M1 1343.32H687.485V687.484H1343.2V0"
        stroke={topColor}
        strokeWidth={strokeWidth}
        variants={pathVariants}
      />
      <motion.path
        d="M125 905.064V125H905.064"
        stroke={topColor}
        strokeWidth={strokeWidth}
        variants={pathVariants}
      />
      {/* Bottom */}
      <motion.path
        d="M2279.2 937H1592.72V1592.84H937V2280.32"
        stroke={bottomColor}
        strokeWidth={strokeWidth}
        variants={pathVariants}
      />
      <motion.path
        d="M2164.2 1378.26V2158.32H1384.14"
        stroke={bottomColor}
        strokeWidth={strokeWidth}
        variants={pathVariants}
      />
    </motion.svg>
  );
}
