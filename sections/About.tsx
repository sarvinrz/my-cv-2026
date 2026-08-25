"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import { useLocaleFormat } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentFor } from "@/lib/design-tokens";

/** Word-level opacity scrub: the paragraph writes itself as you read it. */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} data-word className="opacity-20">
          {word}{" "}
        </span>
      ))}
    </>
  );
}

export function About() {
  const t = useTranslations("about");
  const fmt = useLocaleFormat();
  const focus = t.raw("focus") as string[];
  const rawStats = t.raw("stats");
  const stats = Array.isArray(rawStats)
    ? (rawStats as { value: string; label: string }[])
    : [];
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector("[data-about-headline]"),
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 75%" },
        },
      );

      section.querySelectorAll("[data-reveal-block]").forEach((block) => {
        gsap.to(block.querySelectorAll("[data-word]"), {
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: { trigger: block, start: "top 82%", end: "bottom 55%", scrub: true },
        });
      });

      section.querySelectorAll("[data-focus-item]").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 24, rotateX: -10 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scrollTrigger: { trigger: item, start: "top 92%", end: "top 68%", scrub: true },
          },
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      sectionRef.current
        ?.querySelectorAll<HTMLElement>("[data-word], [data-focus-item]")
        .forEach((el) => {
          el.style.opacity = "1";
        });
    });

    return () => mm.revert();
  }, []);

  return (
    <Section
      id="about"
      label="About"
      className="border-t border-border bg-surface"
      aura={{ accent: "sky", className: "end-[-8%] top-[10%] h-[340px] w-[340px]" }}
    >
      <div ref={sectionRef}>
        <SectionHeading number="01" label={t("label")} accent="sky" />

        <h2
          data-about-headline
          className="mt-6 w-full font-display text-display font-semibold sm:mt-8"
        >
          {t("headline")}
        </h2>

        {stats.length > 0 ? (
          <ul className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-8">
            {stats.map((stat) => (
              <li key={stat.label} className="min-w-0">
                <p className="font-display text-xl font-semibold tabular-nums sm:text-2xl md:text-3xl">
                  {fmt.digits(stat.value)}
                </p>
                <p className="mt-1.5 text-[11px] leading-snug text-muted sm:max-w-48 sm:text-sm">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-2 lg:gap-10">
          <p data-reveal-block className="text-base leading-relaxed md:text-lg">
            <Words text={t("p1")} />
          </p>
          <p data-reveal-block className="text-base leading-relaxed md:text-lg">
            <Words text={t("p2")} />
          </p>
        </div>

        <div className="mt-16">
          <h3 className="eyebrow text-muted">{t("focusTitle")}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focus.map((item, i) => (
              <Card
                key={item}
                as="li"
                accent={accentFor(i)}
                data-focus-item
                className="flex items-start gap-3 text-sm opacity-0"
                style={{ perspective: 800 }}
              >
                <span
                  className="mt-1 h-4 w-1 shrink-0 rounded-full"
                  style={{ background: "var(--card-accent)" }}
                  aria-hidden
                />
                {item}
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
