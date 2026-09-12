"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
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
  expandLabel: string;
  collapseLabel: string;
  expandHint: string;
};

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

function NavChevrons({
  index,
  slideCount,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  size = "md",
}: {
  index: number;
  slideCount: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  size?: "md" | "lg";
}) {
  if (slideCount < 2) return null;
  const btn =
    size === "lg"
      ? "h-11 w-11 md:h-12 md:w-12"
      : "h-9 w-9 md:h-10 md:w-10";

  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        disabled={index === 0}
        aria-label={prevLabel}
        data-cursor="link"
        className={`absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-surface/95 text-foreground/80 shadow-md backdrop-blur-sm transition-all hover:border-accent-secondary/50 hover:text-accent-secondary disabled:pointer-events-none disabled:opacity-30 md:left-3 ${btn}`}
      >
        <ChevronIcon dir="left" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={index === slideCount - 1}
        aria-label={nextLabel}
        data-cursor="link"
        className={`absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-border/80 bg-surface/95 text-foreground/80 shadow-md backdrop-blur-sm transition-all hover:border-accent-secondary/50 hover:text-accent-secondary disabled:pointer-events-none disabled:opacity-30 md:right-3 ${btn}`}
      >
        <ChevronIcon dir="right" />
      </button>
    </>
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
  expandLabel,
  collapseLabel,
  expandHint,
}: Props) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const indexRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const touchRef = useRef({ x: 0, y: 0, active: false });
  const slideCount = slides.length;
  const slideCountRef = useRef(slideCount);
  slideCountRef.current = slideCount;
  const accentColor = accents[accent].base;

  const scrollPerSlide = useCallback(() => window.innerHeight * 0.5, []);

  const measure = useCallback(() => viewportRef.current?.offsetWidth ?? 0, []);

  const scrollDistance = useCallback(
    () => Math.max(0, slideCountRef.current - 1) * scrollPerSlide(),
    [scrollPerSlide],
  );

  const maxTrackX = useCallback(() => -(slideCountRef.current - 1) * measure(), [measure]);

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

      if (st && slideCountRef.current > 1 && !expanded) {
        const count = slideCountRef.current;
        const progress = count > 1 ? clamped / (count - 1) : 0;
        const target = st.start + progress * (st.end - st.start);
        st.scroll(target);
        return;
      }

      applyIndex(clamped, true);
    },
    [applyIndex, expanded, slideCount],
  );

  const goPrev = () => scrollToIndex(indexRef.current - 1);
  const goNext = () => scrollToIndex(indexRef.current + 1);
  const openExpanded = () => setExpanded(true);
  const closeExpanded = () => setExpanded(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeExpanded();
      if (e.key === "ArrowLeft") scrollToIndex(indexRef.current - 1);
      if (e.key === "ArrowRight") scrollToIndex(indexRef.current + 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded, scrollToIndex]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || slideCountRef.current < 2) return;

      ScrollTrigger.getById(scrollTriggerId)?.kill();

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        {
          x: maxTrackX,
          ease: "none",
          scrollTrigger: {
            id: scrollTriggerId,
            trigger: section,
            start: "center center",
            end: () => `+=${scrollDistance()}`,
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const count = slideCountRef.current;
              if (count < 2) return;
              const idx = Math.min(count - 1, Math.round(self.progress * (count - 1)));
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
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      applyIndex(0, false);
    });

    return () => {
      stRef.current = null;
      mm.revert();
    };
  }, [
    applyIndex,
    maxTrackX,
    onSlideChange,
    scrollDistance,
    scrollTriggerId,
    sectionRef,
    slideCount,
  ]);

  useEffect(() => {
    indexRef.current = 0;
    setIndex(0);
    applyIndex(0, false);
  }, [slideCount, applyIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const ro = new ResizeObserver(() => {
      const track = trackRef.current;
      if (!track) return;
      gsap.set(track, { x: -indexRef.current * measure() });
      stRef.current?.refresh();
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [measure]);

  const bindSwipe = (onSwipe: (dir: "left" | "right") => void) => ({
    onTouchStart: (e: React.TouchEvent) => {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!touchRef.current.active) return;
      touchRef.current.active = false;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      onSwipe(dx < 0 ? "left" : "right");
    },
  });

  const counterUrl = `${url} — ${String(index + 1).padStart(2, "0")}/${String(slideCount).padStart(2, "0")}`;

  const slideViewport = (
    <div className="relative bg-surface-elevated">
      <div
        ref={viewportRef}
        className="group/viewport relative overflow-hidden touch-pan-y"
        title={expandHint}
        {...bindSwipe((dir) => (dir === "left" ? goNext() : goPrev()))}
        onDoubleClick={openExpanded}
      >
        <div ref={trackRef} className="flex will-change-transform">
          {slides.map((slide, i) => (
            <div key={slide.src} className="relative aspect-[16/10] w-full shrink-0 bg-surface-elevated sm:aspect-video">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 560px, 95vw"
                priority={priority && i === 0}
                unoptimized={slide.src.endsWith(".gif") || slide.src.endsWith(".svg")}
              />
            </div>
          ))}
        </div>

        <NavChevrons index={index} slideCount={slideCount} onPrev={goPrev} onNext={goNext} prevLabel={prevLabel} nextLabel={nextLabel} />

        <button
          type="button"
          onClick={openExpanded}
          aria-label={expandLabel}
          title={expandHint}
          data-cursor="link"
          className="absolute end-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-border/90 bg-surface/95 text-foreground/85 shadow-md backdrop-blur-sm transition-all hover:border-accent hover:text-accent md:end-3 md:top-3 md:h-11 md:w-11"
        >
          <ExpandIcon />
        </button>

        <p className="pointer-events-none absolute bottom-2 start-1/2 z-10 hidden -translate-x-1/2 rounded-md bg-surface/90 px-2 py-1 font-mono text-[9px] tracking-wide text-muted opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover/viewport:opacity-100 md:block">
          {expandHint}
        </p>
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
              className="rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
  );

  return (
    <>
      <BrowserFrame url={counterUrl}>{slideViewport}</BrowserFrame>

      {mounted && expanded
        ? createPortal(
            <div
              className="fixed inset-0 z-[200] flex items-center justify-center bg-background/92 p-3 backdrop-blur-md sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={expandLabel}
              onClick={closeExpanded}
              {...bindSwipe((dir) => (dir === "left" ? goNext() : goPrev()))}
            >
              <button
                type="button"
                onClick={closeExpanded}
                className="absolute end-3 top-3 z-30 flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 font-mono text-[10px] tracking-wider text-muted hover:text-accent sm:end-5 sm:top-5"
              >
                <ExpandIcon />
                {collapseLabel}
              </button>

              <div
                className="relative w-full max-w-6xl overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={closeExpanded}
              >
                <div className="relative aspect-[16/10] w-full max-h-[82dvh] sm:aspect-video">
                  <Image
                    src={slides[index].src}
                    alt={slides[index].alt}
                    fill
                    className="object-contain object-center"
                    sizes="100vw"
                    priority
                    unoptimized={slides[index].src.endsWith(".gif") || slides[index].src.endsWith(".svg")}
                  />
                  <NavChevrons
                    index={index}
                    slideCount={slideCount}
                    onPrev={goPrev}
                    onNext={goNext}
                    prevLabel={prevLabel}
                    nextLabel={nextLabel}
                    size="lg"
                  />
                </div>

                {slideCount > 1 && (
                  <div className="flex items-center justify-center gap-2 border-t border-border bg-surface px-3 py-3">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => applyIndex(i, true)}
                        aria-label={goToLabel(i + 1)}
                        aria-current={i === index ? "true" : undefined}
                        className="rounded-full transition-all duration-300"
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
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
