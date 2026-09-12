"use client";

import { useTranslations } from "next-intl";
import { Nav } from "@/components/navigation/Nav";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollRestore } from "@/components/providers/ScrollRestore";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Experience } from "@/sections/Experience";
import { Education } from "@/sections/Education";
import { Contact } from "@/sections/Contact";

export function PortfolioPage() {
  const t = useTranslations("common");

  return (
    <SmoothScroll>
      <ScrollRestore />
      <a
        href="#about"
        className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-md bg-accent px-4 py-2 font-mono text-xs text-accent-contrast transition-transform focus:translate-y-0"
      >
        {t("skip")}
      </a>
      <Nav />
      <Cursor />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
