"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import { experienceIds } from "@/lib/site";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentFor, accents } from "@/lib/design-tokens";

export function Experience() {
  const t = useTranslations("experience");
  const rootRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLSpanElement>(null);

  const jobs = t.raw("items") as Record<
    string,
    { company: string; role: string; period: string; summary: string; highlights: string[] }
  >;

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const root = rootRef.current;
      const lineFill = lineFillRef.current;
      if (!root || !lineFill) return;

      // The track fills exactly in step with how far you've read.
      gsap.fromTo(
        lineFill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.querySelector("[data-timeline]"),
            start: "top 62%",
            end: "bottom 78%",
            scrub: 0.4,
          },
        },
      );

      root.querySelectorAll("[data-exp-item]").forEach((item) => {
        const content = item.querySelector("[data-exp-content]");
        const node = item.querySelector("[data-exp-node]");

        if (content) {
          gsap.fromTo(
            content,
            { opacity: 0.2, y: 44 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: item, start: "top 84%", end: "top 48%", scrub: 0.6 },
            },
          );
        }

        // The node lights up as the filling track reaches it.
        if (node) {
          gsap.fromTo(
            node,
            { scale: 0.5, opacity: 0.3 },
            {
              scale: 1,
              opacity: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 78%", end: "top 62%", scrub: true },
            },
          );
        }

        item.querySelectorAll("[data-exp-highlight]").forEach((highlight, i) => {
          gsap.fromTo(
            highlight,
            { opacity: 0, x: -14 },
            {
              opacity: 1,
              x: 0,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: `top+=${70 + i * 26} 78%`,
                end: `top+=${120 + i * 26} 56%`,
                scrub: true,
              },
            },
          );
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      rootRef.current
        ?.querySelectorAll<HTMLElement>("[data-exp-content], [data-exp-highlight], [data-exp-node]")
        .forEach((el) => {
          el.style.opacity = "1";
        });
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="experience"
      label="Experience"
      className="border-t border-border bg-surface"
      aura={{ accent: "sage", className: "end-[-12%] top-[30%] h-[400px] w-[400px]" }}
    >
      <div ref={rootRef}>
        <SectionHeading
          number="04"
          label={t("label")}
          accent="sage"
          title={t("title")}
          lead={t("lead")}
        />

        <div data-timeline className="relative mt-14 md:mt-20">
          <span
            className="absolute start-0 top-0 hidden h-full w-px bg-border md:block"
            aria-hidden
          />
          <span
            ref={lineFillRef}
            className="absolute start-0 top-0 hidden h-full w-px origin-top scale-y-0 bg-gradient-to-b from-accent-secondary via-accent to-accent/20 md:block"
            aria-hidden
          />

          <ol className="flex flex-col gap-10 md:gap-14 md:ps-14">
            {experienceIds.map((id, i) => {
              const job = jobs[id];
              if (!job) return null;

              const accent = accentFor(i);
              const isCurrent = i === 0;

              return (
                <li key={id} data-exp-item className="relative">
                  <span
                    data-exp-node
                    className="absolute -start-[19px] top-7 hidden h-2.5 w-2.5 rounded-full ring-4 ring-surface md:block"
                    style={{ background: accents[accent].base }}
                    aria-hidden
                  />

                  <Card
                    as="article"
                    accent={accent}
                    data-exp-content
                    className="opacity-20"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <p
                        className="eyebrow"
                        style={{ color: accents[accent].base }}
                      >
                        {job.role}
                      </p>
                      {isCurrent ? (
                        <span className="relative flex h-1.5 w-1.5" aria-hidden>
                          <span className="absolute inset-0 rounded-full bg-sage" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-sage opacity-70" />
                        </span>
                      ) : null}
                      <p className="font-mono text-[11px] tabular-nums text-muted">{job.period}</p>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-semibold leading-snug md:text-2xl">
                      {job.company}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                      {job.summary}
                    </p>

                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {(job.highlights ?? []).map((line) => (
                        <li
                          key={line}
                          data-exp-highlight
                          className="flex gap-2.5 text-sm leading-relaxed text-foreground/80 opacity-0"
                        >
                          <span
                            className="mt-2 h-1 w-2.5 shrink-0 rounded-full"
                            style={{ background: accents[accent].base }}
                            aria-hidden
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Section>
  );
}
