"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function TabContentTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      key={Math.random()}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
