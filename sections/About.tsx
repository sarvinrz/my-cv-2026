"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "@/lib/gsap";
import { Section, SectionHeading } from "@/components/ui/Section";

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
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      sectionRef.current?.querySelectorAll<HTMLElement>("[data-word]").forEach((el) => {
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
          className="mt-5 w-full font-display text-display font-semibold sm:mt-6"
        >
          {t("headline")}
        </h2>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-8">
          <p data-reveal-block className="text-base leading-relaxed md:text-lg">
            <Words text={t("p1")} />
          </p>
          <p data-reveal-block className="text-base leading-relaxed md:text-lg">
            <Words text={t("p2")} />
          </p>
        </div>
      </div>
    </Section>
  );
}
