"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocaleFormat } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { AvatarCanvas } from "@/components/three/AvatarCanvas";
import { avatarState } from "@/components/three/avatarState";
import { site } from "@/lib/site";

/**
 * Splits a line into word-level masks. Word level rather than character
 * level on purpose: Persian is a joined script and per-character spans
 * break its shaping.
 */
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

  const concepts = t.raw("concepts") as string[];

  const degreeFormat = useMemo(
    () => new Intl.NumberFormat(fmt.locale === "fa" ? "fa-IR" : "en-US", { maximumFractionDigits: 0 }),
    [fmt.locale],
  );

  useEffect(() => {
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

      // The single source of rotation: scroll progress across the pin.
      const spin = gsap.timeline({
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

      // Concepts light up one quarter-turn at a time.
      q("[data-concept]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0.22, x: -14 },
          {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: section,
              start: `top+=${90 + i * 90} top`,
              end: `top+=${200 + i * 90} top`,
              scrub: true,
            },
          },
        );
      });

      // Sparkle beat near a full turn.
      gsap.fromTo(
        q("[data-hero-hint]"),
        { opacity: 0.4 },
        {
          opacity: 1,
          scrollTrigger: { trigger: section, start: "82% top", end: "94% top", scrub: true },
        },
      );

      // Cinematic hand-off into About: no hard cut.
      gsap.to(q("[data-hero-stage]"), {
        scale: 0.94,
        opacity: 0.25,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: { trigger: section, start: "88% top", end: "bottom top", scrub: true },
      });

      return () => {
        spin.kill();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      avatarState.scrollProgress = 0;
    });

    return () => mm.revert();
  }, [degreeFormat]);

  const resumeHref = fmt.locale === "fa" ? site.resumeFa : site.resumeEn;
  const titleLines = [t("titleLine1"), t("titleLine2"), t("titleLine3")].filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative h-[260vh] motion-reduce:h-auto"
    >
      <span
        aria-hidden
        className="aura start-[-10%] top-[8%] h-[420px] w-[420px] bg-sky"
      />
      <span
        aria-hidden
        className="aura end-[-6%] top-[42%] h-[360px] w-[360px] bg-gold"
      />

      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden motion-reduce:static">
        <div
          data-hero-stage
          className="mx-auto w-full max-w-6xl px-6 pb-12 pt-28 md:px-10 md:pb-16 md:pt-32"
        >
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* ---------------- Type column ---------------- */}
            <div className="relative z-10">
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

              <h1 className="mt-5 font-display text-mega font-bold">
                {titleLines.map((line, i) => (
                  <MaskedLine
                    key={line}
                    text={line}
                    className={`block ${i === 1 ? "text-accent" : ""}`}
                  />
                ))}
              </h1>

              <p
                data-hero-fade
                className="mt-6 max-w-lg text-lead text-muted"
              >
                {meta("tagline")}
              </p>

              <ul className="mt-8 flex flex-col gap-2.5">
                {concepts.map((concept, i) => (
                  <li
                    key={concept}
                    data-concept
                    className="flex items-baseline gap-3 text-sm text-foreground/80 md:text-base"
                  >
                    <span className="font-mono text-[10px] text-accent">
                      {fmt.index(i + 1)}
                    </span>
                    {concept}
                  </li>
                ))}
              </ul>

              <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
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

            {/* 3D character — no card, same background as the text column */}
            <div
              data-hero-visual
              className="relative mx-auto flex h-[min(68vh,520px)] w-full max-w-md flex-col items-center justify-center lg:max-w-none"
            >
              <div className="relative h-full w-full min-h-[300px]">
                <AvatarCanvas compact />
              </div>
              <p
                data-hero-hint
                className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-wider text-muted"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                  <path
                    d="M8 7 4 12l4 5M16 7l4 5-4 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                {t("dragHint")}
                <span className="text-accent">
                  · <span ref={degreeRef}>0</span>°
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
