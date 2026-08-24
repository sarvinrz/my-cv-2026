"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
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
  const focus = t.raw("focus") as string[];
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
          className="mt-8 max-w-3xl text-balance font-display text-display font-semibold"
        >
          {t("headline")}
        </h2>

        <div className="mt-12 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-10">
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
