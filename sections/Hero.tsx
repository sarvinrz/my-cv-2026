"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocaleFormat } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { AvatarCanvas } from "@/components/three/AvatarCanvas";
import { avatarState } from "@/components/three/avatarState";
import { site } from "@/lib/site";

function MaskedLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span data-hero-word className="inline-block will-change-transform">
            {word}
            {i < text.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const meta = useTranslations("meta");
  const fmt = useLocaleFormat();

  const sectionRef = useRef<HTMLElement>(null);
  const degreeRef = useRef<HTMLSpanElement>(null);

  const degreeFormat = useMemo(
    () => new Intl.NumberFormat(fmt.locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 0 }),
    [fmt.locale],
  );

  useEffect(() => {
    avatarState.scrollProgress = 0;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      if (!section) return;
      const q = gsap.utils.selector(section);

      const intro = gsap.timeline({ delay: 0.1 });

      intro
        .fromTo(
          q("[data-hero-word]"),
          { yPercent: 115 },
          { yPercent: 0, duration: 1.05, ease: "power4.out", stagger: 0.045 },
        )
        .fromTo(
          q("[data-hero-fade]"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
          0.35,
        )
        .fromTo(
          q("[data-hero-visual]"),
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" },
          0.2,
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (st) => {
            avatarState.scrollProgress = st.progress;
            if (degreeRef.current) {
              degreeRef.current.textContent = degreeFormat.format(st.progress * 360);
            }
          },
        },
      });

      gsap.fromTo(
        q("[data-hero-hint]"),
        { opacity: 0.4 },
        {
          opacity: 1,
          scrollTrigger: { trigger: section, start: "82% top", end: "94% top", scrub: true },
        },
      );

      gsap.to(q("[data-hero-stage]"), {
        scale: 0.94,
        opacity: 0.25,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: section, start: "88% top", end: "bottom top", scrub: true },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      avatarState.scrollProgress = 0;
    });

    return () => mm.revert();
  }, [degreeFormat, fmt.locale]);

  const resumeHref = fmt.locale === "fa" ? site.resumeFa : site.resumeEn;
  const titleLines = [t("titleLine1"), t("titleLine2"), t("titleLine3")].filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative h-[118vh] sm:h-[125vh] lg:h-[135vh] motion-reduce:h-auto"
    >
      <span aria-hidden className="aura start-[-10%] top-[8%] h-[420px] w-[420px] bg-sky" />
      <span aria-hidden className="aura end-[-6%] top-[42%] h-[360px] w-[360px] bg-gold" />

      <div className="sticky top-0 flex min-h-dvh items-start overflow-hidden pt-20 motion-reduce:static motion-reduce:pt-0 sm:items-center sm:pt-0">
        <div
          data-hero-stage
          className="mx-auto w-full max-w-6xl px-4 pb-6 pt-4 sm:px-6 md:px-10 md:pb-8 md:pt-28"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div
              data-hero-visual
              className="relative order-1 mx-auto flex h-[min(46svh,360px)] w-full max-w-md flex-col items-center justify-center sm:h-[min(52svh,420px)] lg:order-2 lg:h-[min(62vh,480px)] lg:max-w-none"
            >
              <div className="relative h-full w-full min-h-[240px]">
                <AvatarCanvas compact />
              </div>
              <p
                data-hero-hint
                className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted"
              >
                <span className="text-accent">
                  <span ref={degreeRef}>0</span>°
                </span>
              </p>
            </div>

            <div className="relative z-10 order-2 lg:order-1">
              <p
                data-hero-fade
                className="eyebrow inline-flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-3 py-1.5 text-muted"
              >
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 rounded-full bg-sage" />
                  <span className="absolute inset-0 animate-ping rounded-full bg-sage opacity-60" />
                </span>
                {t("status")}
              </p>

              <h1 className="mt-4 font-display text-mega font-bold sm:mt-5">
                {titleLines.map((line, i) => (
                  <MaskedLine
                    key={line}
                    text={line}
                    className={`block ${i === 1 ? "text-accent" : ""}`}
                  />
                ))}
              </h1>

              <p data-hero-fade className="mt-4 max-w-lg text-lead text-muted sm:mt-5">
                {meta("tagline")}
              </p>

              <div data-hero-fade className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                <a
                  href="#work"
                  data-cursor="link"
                  className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-contrast transition-transform duration-[--d-fast] hover:-translate-y-0.5"
                >
                  {t("ctaWork")}
                </a>
                <a
                  href={resumeHref}
                  download
                  data-cursor="link"
                  className="rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-[--d-fast] hover:border-accent hover:text-accent"
                >
                  {t("ctaResume")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
