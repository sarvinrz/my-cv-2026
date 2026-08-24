"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { motion as tokens, easeOut } from "@/lib/design-tokens";
/**
 * The site's one entrance animation. Sections compose it rather than each
 * writing their own variants, so timing and distance stay identical
 * everywhere. `prefers-reduced-motion` is handled by motion itself.
 */
const variants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 24 },
    shown: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    shown: { opacity: 1, scale: 1 },
  },
  /** Cards flipping up off the page — used for grids. */
  tilt: {
    hidden: { opacity: 0, y: 28, rotateX: -8 },
    shown: { opacity: 1, y: 0, rotateX: 0 },
  },
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  duration = tokens.duration.slow,
  className,
  as = "div",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section" | "p" | "h2" | "h3" | "ul";
}) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration, delay, ease: easeOut }}
      style={variant === "tilt" ? { perspective: 900 } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Reveals children one after another. Children must be `RevealItem`s (or
 * anything using the `item` variants below).
 */
export function RevealGroup({
  children,
  className,
  stagger = tokens.stagger,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      variants={{ shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  variant = "up",
  duration = tokens.duration.slow,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  duration?: number;
  as?: "div" | "li" | "article" | "p" | "span";
}) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={variants[variant]}
      transition={{ duration, ease: easeOut }}
    >
      {children}
    </Tag>
  );
}
