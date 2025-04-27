"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const backgroundElements = [
  { left: 20, top: 15, size: 40 },
  { left: 80, top: 20, size: 30 },
  { left: 15, top: 70, size: 45 },
  { left: 70, top: 80, size: 35 },
  { left: 40, top: 40, size: 25 },
  { left: 85, top: 60, size: 50 },
  { left: 30, top: 85, size: 40 },
  { left: 60, top: 30, size: 35 },
];

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 overflow-hidden">
      <div className="relative">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 -z-10">
          {backgroundElements.map((element, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                width: `${element.size}px`,
                height: `${element.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.1,
                scale: 1,
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <div className="w-full h-full bg-primary rounded-lg" />
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-12 relative">
          {/* Animated 404 Text */}
          <motion.div
            variants={floatingAnimation}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                type: "spring",
                bounce: 0.4,
              }}
              className="text-9xl font-bold text-primary"
            >
              404
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-foreground"
            >
              Oops! Page Not Found
            </motion.h2>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
               className="rounded-full"
              >
                <Home className="w-5 h-5" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
