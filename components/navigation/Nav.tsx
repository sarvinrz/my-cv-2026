"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { easeOut } from "@/lib/design-tokens";

const SECTION_IDS = ["about", "stack", "work", "experience", "education", "languages", "contact"] as const;

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  const links = [
    { id: "about", label: t("about") },
    { id: "work", label: t("work") },
    { id: "stack", label: t("stack") },
    { id: "experience", label: t("experience") },
    { id: "education", label: t("education") },
    { id: "languages", label: t("langNav") },
    { id: "contact", label: t("contact") },
  ] as const;

  const resumeHref = locale === "fa" ? site.resumeFa : site.resumeEn;
  const drawerSide = locale === "fa" ? "left" : "right";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bar = progressRef.current;
        if (!bar) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[--d-slow] ${
          scrolled || menuOpen ? "border-b border-border bg-background/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 md:px-10"
        >
          <a
            href="#top"
            className="flex min-w-0 shrink-0 items-center gap-2 transition-opacity duration-[--d-fast] hover:opacity-75"
          >
            <Image
              src={site.profilePhoto}
              alt={site.name}
              width={72}
              height={72}
              className="h-9 w-9 shrink-0 rounded-full border border-border object-cover sm:h-10 sm:w-10"
              priority
            />
            <span className="hidden truncate text-sm font-medium tracking-tight sm:inline">{site.firstName}</span>
          </a>

          <ul className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className={`eyebrow relative whitespace-nowrap rounded-md px-2 py-2 text-[10px] tracking-wide transition-colors duration-[--d-fast] 2xl:px-2.5 2xl:text-[11px] ${
                    active === link.id ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active === link.id ? (
                    <span aria-hidden className="absolute inset-x-2 bottom-1 h-px bg-accent" />
                  ) : null}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
            <a
              href={resumeHref}
              download
              className="eyebrow hidden rounded-md border border-border px-3 py-2 text-[10px] text-foreground/80 transition-colors duration-[--d-fast] hover:border-accent hover:text-accent md:inline-block"
            >
              {t("resume")}
            </a>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground/80 transition-colors hover:border-accent hover:text-accent xl:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 block h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] block h-px w-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute bottom-0 left-0 block h-px w-full bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </nav>

        <span
          ref={progressRef}
          aria-hidden
          className="block h-px origin-[left_center] scale-x-0 bg-gradient-to-r from-accent-secondary via-accent to-accent/30 rtl:origin-[right_center]"
        />
      </header>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {menuOpen ? (
                <>
                  <motion.button
                    type="button"
                    aria-label={t("menuClose")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[60] bg-background/55 backdrop-blur-[6px] xl:hidden"
                    onClick={closeMenu}
                  />
                  <motion.div
                    id="mobile-nav-drawer"
                    role="dialog"
                    aria-modal="true"
                    aria-label={t("menuOpen")}
                    initial={{ x: drawerSide === "right" ? "100%" : "-100%", opacity: 0.6 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: drawerSide === "right" ? "100%" : "-100%", opacity: 0.6 }}
                    transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    className={`fixed inset-y-0 z-[70] flex w-[min(88vw,320px)] flex-col border-border bg-background/98 shadow-2xl backdrop-blur-xl xl:hidden ${
                      drawerSide === "right" ? "end-0 border-s" : "start-0 border-e"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <p className="eyebrow text-muted">{site.firstName}</p>
                      <button
                        type="button"
                        onClick={closeMenu}
                        aria-label={t("menuClose")}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted hover:text-accent"
                      >
                        ✕
                      </button>
                    </div>

                    <ul className="flex-1 overflow-y-auto px-3 py-4">
                      {links.map((link, i) => (
                        <motion.li
                          key={link.id}
                          initial={{ opacity: 0, x: drawerSide === "right" ? 24 : -24 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + i * 0.045, duration: 0.35, ease: easeOut }}
                        >
                          <a
                            href={`#${link.id}`}
                            onClick={closeMenu}
                            aria-current={active === link.id ? "true" : undefined}
                            className={`mb-1 flex items-center justify-between rounded-xl px-4 py-3.5 font-mono text-xs tracking-wider transition-colors ${
                              active === link.id
                                ? "bg-surface-elevated text-foreground"
                                : "text-muted hover:bg-surface-elevated/70 hover:text-foreground"
                            }`}
                          >
                            {link.label}
                            <span className="text-[10px] text-accent/70">{String(i + 1).padStart(2, "0")}</span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>

                    <div className="space-y-2 border-t border-border p-4">
                      <a
                        href={resumeHref}
                        download
                        onClick={closeMenu}
                        className="block rounded-xl border border-border py-3 text-center font-mono text-xs tracking-wider text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        {t("resume")} ↓
                      </a>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
