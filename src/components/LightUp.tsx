"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** A product coming into the spotlight: it rises and its light comes up. */
export default function LightUp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className={className}
        initial={{ opacity: 0.25, y: 48, filter: "brightness(0.3)" }}
        whileInView={{ opacity: 1, y: 0, filter: "brightness(1)" }}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
