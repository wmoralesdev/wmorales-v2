"use client";

import { motion } from "framer-motion";

export function AnimatedMesh() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background opacity-50" />
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%)",
          ],
        }}
        className="absolute inset-0 opacity-60 dark:opacity-100"
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
