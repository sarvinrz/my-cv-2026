"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useLocaleFormat } from "@/lib/format";
import { gsap } from "@/lib/gsap";
import { AvatarCanvas } from "@/components/three/AvatarCanvas";
import { avatarState } from "@/components/three/avatarState";
import { site } from "@/lib/site";
import { CodeRole } from "@/components/ui/CodeRole";

function MaskedLine({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pt-[0.12em] align-bottom"
        >
          <span data-hero-word className="inline-block will-change-transform">
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const fmt = useLocaleFormat();

  const sectionRef = useRef<HTMLElement>(null);

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
          end: () => `+=${Math.round(window.innerHeight * 1.85)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (st) => {
            avatarState.scrollProgress = st.progress;
          },
        },
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      avatarState.scrollProgress = 0;
    });

    return () => mm.revert();
  }, [fmt.locale]);

  const resumeHref = fmt.locale === "fa" ? site.resumeFa : site.resumeEn;

  return (
    <section ref={sectionRef} id="top" aria-label="Introduction" className="relative">
      <span aria-hidden className="aura start-[-10%] top-[8%] h-[420px] w-[420px] bg-sky" />
      <span aria-hidden className="aura end-[-6%] top-[42%] h-[360px] w-[360px] bg-gold" />

      <div
        data-hero-stage
        className="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-4 py-20 sm:px-6 md:px-10"
      >
        <div className="grid w-full items-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div
            data-hero-visual
            className="relative order-1 mx-auto flex h-[min(42svh,340px)] w-full max-w-md flex-col items-center justify-center sm:h-[min(48svh,400px)] lg:order-2 lg:h-[min(58vh,460px)] lg:max-w-none"
          >
            <div className="relative h-full w-full min-h-[220px]">
              <AvatarCanvas compact />
            </div>
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

            <h1 className="mt-4 font-display text-mega font-bold leading-[1.35] sm:mt-5 lg:leading-[1.25]">
              {fmt.locale === "fa" ? (
                <>
                  <MaskedLine text={t("firstName")} />
                  {"\u00A0"}
                  <MaskedLine text={t("lastName")} className="text-accent" />
                </>
              ) : (
                <>
                  <MaskedLine text={t("firstName")} />
                  <MaskedLine text={t("lastName")} className="mt-0 block text-accent" />
                </>
              )}
            </h1>

            <div data-hero-fade>
              <CodeRole text={t("codeRole")} />
            </div>

            <p data-hero-fade className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              {t("lead")}
            </p>

            <div data-hero-fade className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
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
    </section>
  );
}
