"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { localizeDigits } from "@/lib/format";
import { site } from "@/lib/site";
import { motion as tokens, easeOut } from "@/lib/design-tokens";
import { FooterIllustration, SocialLink } from "@/components/ui/ContactSocial";

export function Contact() {
  const t = useTranslations("contact");
  const th = useTranslations("hero");
  const locale = useLocale();

  const resumeHref = locale === "fa" ? site.resumeFa : site.resumeEn;

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="relative flex min-h-[70vh] flex-col justify-between overflow-hidden border-t border-border bg-background pb-8 pt-14 md:pt-20"
    >
      <span aria-hidden className="aura start-[20%] top-[10%] h-[460px] w-[460px] bg-sky" />
      <span aria-hidden className="aura end-[8%] bottom-[16%] h-[320px] w-[320px] bg-gold" />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4 sm:px-6 md:px-10">
        <FooterIllustration />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: tokens.duration.slow, ease: easeOut }}
          className="mx-auto mt-8 max-w-xl text-center text-lead text-muted md:mt-10"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: tokens.duration.slow, ease: easeOut }}
          className="mt-12 flex flex-col items-center gap-10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href={`mailto:${site.email}`}
              data-cursor="link"
              className="font-mono text-base text-foreground/85 transition-colors duration-[--d-fast] hover:text-accent md:text-lg"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone}`}
              className="font-mono text-sm text-muted transition-colors duration-[--d-fast] hover:text-accent"
            >
              {site.phone}
            </a>
          </div>

          <nav aria-label="Social links" className="flex flex-wrap items-end justify-center gap-8 md:gap-12">
            <SocialLink href={site.github} label="GitHub" icon="/social-media/github.png" />
            <SocialLink href={site.linkedin} label="LinkedIn" icon="/social-media/linkedin.png" />
            <SocialLink href={`mailto:${site.email}`} label="Email" icon="/social-media/gmail.png" />
          </nav>
        </motion.div>
      </div>

      <footer className="relative mx-auto mt-16 flex w-full max-w-6xl flex-col items-center gap-3 border-t border-border px-4 pt-6 sm:px-6 md:mt-20 md:flex-row md:justify-between md:px-10">
        <p className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] tracking-wider text-muted">
          <span>© {localizeDigits("2026", locale)} {th("firstName")} {th("lastName")}</span>
          <span aria-hidden>·</span>
          <span>{t("madeWith")}</span>
          <span className="text-sm leading-none" aria-hidden>
            ☕
          </span>
          <span>+</span>
          <span className="text-sm leading-none" aria-hidden>
            ❤️
          </span>
        </p>
        <a
          href={resumeHref}
          download
          className="font-mono text-[11px] tracking-wider text-muted transition-colors duration-[--d-fast] hover:text-accent"
        >
          {t("downloadResume")} ↓
        </a>
      </footer>
    </section>
  );
}
