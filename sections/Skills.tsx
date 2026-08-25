"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { useLocaleFormat } from "@/lib/format";
import { stackCategoryKeys, marqueeRowA, marqueeRowB } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentFor, accents, motion as tokens, easeOut } from "@/lib/design-tokens";

function Marquee({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee marquee-mask overflow-hidden border-y border-border py-3" aria-hidden>
      <div className="marquee-track" data-direction={direction === "right" ? "right" : undefined}>
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center font-mono text-sm text-muted">
            <span className="px-5">{item}</span>
            <span className="text-accent/60">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const t = useTranslations("stack");
  const fmt = useLocaleFormat();
  const categoryData = t.raw("categories") as Record<string, { title: string; items: string }>;

  return (
    <Section
      id="stack"
      label="Technical stack"
      aura={{ accent: "gold", className: "start-[-10%] top-[24%] h-[380px] w-[380px]" }}
    >
      <SectionHeading number="03" label={t("label")} accent="gold" title={t("title")} lead={t("lead")} />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stackCategoryKeys.map((key, i) => {
          const category = categoryData[key];
          if (!category) return null;

          const accent = accentFor(i);
          // Comma-separated in the message file; rendered as individual
          // tokens so a domain reads as a set of tools, not a sentence.
          const tools = category.items.split(/[,،]/).map((tool) => tool.trim()).filter(Boolean);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{
                delay: (i % 3) * 0.06,
                duration: tokens.duration.slow,
                ease: easeOut,
              }}
            >
              <Card accent={accent} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug">{category.title}</h3>
                  <span
                    className="font-mono text-[10px] tabular-nums"
                    style={{ color: accents[accent].base }}
                  >
                    {fmt.index(i + 1)}
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-sm px-2 py-1 font-mono text-[10px] leading-none text-foreground/75"
                      style={{ background: accents[accent].soft }}
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 -mx-6 md:-mx-10">
        <Marquee items={marqueeRowA} direction="left" />
        <Marquee items={marqueeRowB} direction="right" />
      </div>
    </Section>
  );
}
