"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { languageIds } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accents, motion as tokens, easeOut } from "@/lib/design-tokens";

const LEVEL_STEPS: Record<(typeof languageIds)[number], number> = {
  english: 3,
  turkish: 2,
  german: 1,
};

export function Languages() {
  const t = useTranslations("languages");
  const languages = t.raw("items") as Record<string, { name: string; level: string }>;

  return (
    <Section
      id="languages"
      label="Languages"
      aura={{ accent: "sage", className: "end-[-6%] top-[12%] h-[280px] w-[280px]" }}
    >
      <SectionHeading
        number="07"
        label={t("label")}
        accent="sage"
        title={t("title")}
        lead={t("lead")}
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {languageIds.map((id, i) => {
          const language = languages[id];
          if (!language) return null;

          const steps = LEVEL_STEPS[id];
          const accent = i === 0 ? "sage" : i === 1 ? "gold" : "caramel";

          return (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: i * 0.08, duration: tokens.duration.slow, ease: easeOut }}
              className="h-full"
            >
              <Card accent={accent} className="flex h-full flex-col justify-between md:p-6">
                <div>
                  <p className="font-display text-lg font-semibold md:text-xl">{language.name}</p>
                  <p className="mt-1.5 font-mono text-[11px] tracking-wider text-muted">
                    {language.level}
                  </p>
                </div>
                <span className="mt-6 flex items-center gap-1.5" aria-hidden>
                  {[1, 2, 3].map((step) => (
                    <span
                      key={step}
                      className="h-1.5 flex-1 rounded-full"
                      style={{
                        background: step <= steps ? accents[accent].base : "var(--border-strong)",
                      }}
                    />
                  ))}
                </span>
              </Card>
            </motion.li>
          );
        })}
      </ul>
    </Section>
  );
}
