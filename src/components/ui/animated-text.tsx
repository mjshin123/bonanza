"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "letters" | "words";
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  initialY?: number;
  initialOpacity?: number;
  animateY?: number;
  animateOpacity?: number;
}

export default function AnimatedText({
  text,
  className = "text-4xl font-bold",
  animationType = "letters",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.05,
  initialY = 10,
  initialOpacity = 0,
  animateY = 0,
  animateOpacity = 1,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : staggerDelay,
        delayChildren: reducedMotion ? 0 : delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: reducedMotion ? 0 : initialY, opacity: initialOpacity },
    visible: {
      y: animateY,
      opacity: animateOpacity,
      transition: { duration: reducedMotion ? 0 : duration, ease: "easeOut" },
    },
  };

  const parts = animationType === "letters" ? Array.from(text) : text.split(" ");

  return (
    <motion.div
      ref={ref}
      className={className}
      aria-label={text}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {parts.map((part, index) => (
        <motion.span
          key={`${animationType}-${index}`}
          aria-hidden="true"
          variants={itemVariants}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {part}{animationType === "words" && index < parts.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.div>
  );
}
