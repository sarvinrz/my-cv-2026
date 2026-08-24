"use client";

import { useTranslations } from "next-intl";
import { Nav } from "@/components/navigation/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Education } from "@/sections/Education";
import { Languages } from "@/sections/Languages";
import { Contact } from "@/sections/Contact";

export function PortfolioPage() {
  const t = useTranslations("common");

  return (
    <SmoothScroll>
      <a
        href="#about"
        className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-md bg-accent px-4 py-2 font-mono text-xs text-accent-contrast transition-transform focus:translate-y-0"
      >
        {t("skip")}
      </a>
      <Nav />
      <Cursor />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Languages />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
