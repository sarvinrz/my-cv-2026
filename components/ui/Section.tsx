"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { motion } from "motion/react";
import { localizeDigits } from "@/lib/format";
import { accents, easeOut, type AccentName } from "@/lib/design-tokens";

/**
 * Every section on the page uses this shell, so vertical rhythm
 * (96px mobile / 128px desktop), max width (1152px) and gutters
 * (24px / 40px) are identical throughout. See docs/design-system.md.
 */
export function Section({
  id,
  label,
  children,
  className = "",
  aura,
}: {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
  /** Optional coloured backdrop glow, positioned with Tailwind classes. */
  aura?: { accent: AccentName; className: string };
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`relative py-24 md:py-32 ${className}`}
    >
      {aura ? (
        <span
          aria-hidden
          className={`aura ${aura.className}`}
          style={{ background: accents[aura.accent].base }}
        />
      ) : null}
      <div className="relative mx-auto w-full max-w-6xl px-6 md:px-10">{children}</div>
    </section>
  );
}

/**
 * Section marker: an oversized ghost index, the label, and an accent rule
 * that draws itself in as the heading scrolls into view.
 */
export function SectionHeading({
  number,
  label,
  accent = "sky",
  title,
  lead,
}: {
  number: string;
  label: string;
  accent?: AccentName;
  title?: ReactNode;
  lead?: ReactNode;
}) {
  const locale = useLocale();
  const color = accents[accent].base;
  const displayNumber = localizeDigits(number, locale);

  return (
    <header className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 select-none font-display text-[6rem] font-bold leading-none tracking-tighter opacity-[0.06] md:-top-12 md:text-[9rem]"
        style={{ color }}
      >
        {displayNumber}
      </span>

      <div className="relative flex items-center gap-3">
        <span className="eyebrow" style={{ color }}>
          {label}
        </span>
        <motion.span
          aria-hidden
          className="h-px flex-1 origin-[left_center] rtl:origin-[right_center]"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easeOut }}
        />
      </div>

      {title ? (
        <motion.h2
          className="mt-5 max-w-3xl text-balance font-display text-title font-semibold"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.64, ease: easeOut }}
        >
          {title}
        </motion.h2>
      ) : null}

      {lead ? (
        <motion.p
          className="mt-4 max-w-2xl text-lead text-muted"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.64, delay: 0.08, ease: easeOut }}
        >
          {lead}
        </motion.p>
      ) : null}
    </header>
  );
}
