"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { accents, type AccentName } from "@/lib/design-tokens";

export type CarouselSlide = { src: string; alt: string };

type Props = {
  slides: CarouselSlide[];
  url: string;
  accent: AccentName;
  sectionRef: RefObject<HTMLElement | null>;
  scrollTriggerId: string;
  priority?: boolean;
  onSlideChange?: (index: number) => void;
  prevLabel: string;
  nextLabel: string;
  goToLabel: (n: number) => string;
};

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "left" ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  );
}

export function ProjectCarousel({
  slides,
  url,
  accent,
  sectionRef,
  scrollTriggerId,
  priority,
  onSlideChange,
  prevLabel,
  nextLabel,
  goToLabel,
}: Props) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const slideCount = slides.length;
  const accentColor = accents[accent].base;

  const measure = useCallback(() => viewportRef.current?.offsetWidth ?? 0, []);

  const applyIndex = useCallback(
    (next: number, animate: boolean) => {
      const clamped = Math.max(0, Math.min(slideCount - 1, next));
      indexRef.current = clamped;
      setIndex(clamped);
      onSlideChange?.(clamped);

      const w = measure();
      const track = trackRef.current;
      if (!track || !w) return;

      if (animate) {
        gsap.to(track, { x: -clamped * w, duration: 0.45, ease: "power3.out" });
      } else {
        gsap.set(track, { x: -clamped * w });
      }
    },
    [measure, onSlideChange, slideCount],
  );

  const scrollToIndex = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slideCount - 1, next));
      const st = stRef.current;

      if (st && slideCount > 1) {
        const progress = clamped / (slideCount - 1);
        const target = st.start + progress * (st.end - st.start);
        st.scroll(target);
        return;
      }

      applyIndex(clamped, true);
    },
    [applyIndex, slideCount],
  );

  const goPrev = () => scrollToIndex(indexRef.current - 1);
  const goNext = () => scrollToIndex(indexRef.current + 1);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || slideCount < 2) return;

      const scrollPerSlide = () => window.innerHeight * 0.5;

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -(slideCount - 1) * measure(),
          ease: "none",
          scrollTrigger: {
            id: scrollTriggerId,
            trigger: section,
            start: "top top",
            end: () => `+=${(slideCount - 1) * scrollPerSlide()}`,
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (slideCount - 1));
              if (idx !== indexRef.current) {
                indexRef.current = idx;
                setIndex(idx);
                onSlideChange?.(idx);
              }
            },
          },
        },
      );

      stRef.current = tween.scrollTrigger ?? null;
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      applyIndex(0, false);
    });

    return () => mm.revert();
  }, [applyIndex, measure, onSlideChange, scrollTriggerId, sectionRef, slideCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const ro = new ResizeObserver(() => {
      gsap.set(trackRef.current, { x: -indexRef.current * measure() });
      ScrollTrigger.refresh();
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [measure]);

  const counterUrl = `${url} — ${String(index + 1).padStart(2, "0")}/${String(slideCount).padStart(2, "0")}`;

  return (
    <BrowserFrame url={counterUrl}>
      <div className="relative bg-surface-elevated">
        <div ref={viewportRef} className="relative overflow-hidden">
          <div ref={trackRef} className="flex will-change-transform">
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                className="relative aspect-video w-full shrink-0 bg-surface-elevated"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 560px, 90vw"
                  priority={priority && i === 0}
                />
              </div>
            ))}
          </div>

          {slideCount > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={index === 0}
                aria-label={prevLabel}
                data-cursor="link"
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground/80 shadow-md backdrop-blur-sm transition-all hover:border-accent-secondary/50 hover:text-accent-secondary disabled:pointer-events-none disabled:opacity-30 md:left-3 md:h-10 md:w-10"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={index === slideCount - 1}
                aria-label={nextLabel}
                data-cursor="link"
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-foreground/80 shadow-md backdrop-blur-sm transition-all hover:border-accent-secondary/50 hover:text-accent-secondary disabled:pointer-events-none disabled:opacity-30 md:right-3 md:h-10 md:w-10"
              >
                <ChevronIcon dir="right" />
              </button>
            </>
          )}
        </div>

        {slideCount > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-border bg-surface px-3 py-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={goToLabel(i + 1)}
                aria-current={i === index ? "true" : undefined}
                data-cursor="link"
                className="rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{
                  width: i === index ? 22 : 8,
                  height: 8,
                  background: i === index ? accentColor : "var(--border-strong)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </BrowserFrame>
  );
}
