"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { educationIds } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accents, motion as tokens, easeOut } from "@/lib/design-tokens";

export function Education() {
  const t = useTranslations("education");

  const degrees = t.raw("items") as Record<
    string,
    { degree: string; school: string; period: string }
  >;

  return (
    <Section
      id="education"
      label="Education"
      aura={{ accent: "steel", className: "start-[-8%] top-[20%] h-[320px] w-[320px]" }}
    >
      <SectionHeading number="05" label={t("label")} accent="steel" title={t("title")} lead={t("lead")} />

      <ol className="mt-8 grid gap-4">
        {educationIds.map((id, i) => {
          const degree = degrees[id];
          if (!degree) return null;

          const accent = i === 0 ? "steel" : "navy";

          return (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.1, duration: tokens.duration.slow, ease: easeOut }}
            >
              <Card accent={accent} className="md:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    className="font-mono text-[11px] tabular-nums"
                    style={{ color: accents[accent].base }}
                  >
                    {degree.period}
                  </p>
                  {i === 0 ? (
                    <span className="relative flex h-1.5 w-1.5" aria-hidden>
                      <span className="absolute inset-0 rounded-full bg-sage" />
                      <span className="absolute inset-0 animate-ping rounded-full bg-sage opacity-70" />
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-snug md:text-xl">
                  {degree.degree}
                </h3>
                <p className="mt-2 text-sm text-muted">{degree.school}</p>
              </Card>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
