"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { projectsMeta, type ProjectMeta } from "@/lib/site";
import { useLocaleFormat } from "@/lib/format";
import { ProjectCarousel } from "@/components/ui/ProjectCarousel";
import { SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { accentFor, accents } from "@/lib/design-tokens";

type ProjectCopy = {
  title: string;
  category: string;
  description: string;
  story: string[];
  link?: string;
  linkLabel?: string;
};

function ProjectPanel({
  project,
  projectIndex,
  copy,
  isFirst,
}: {
  project: ProjectMeta;
  projectIndex: number;
  copy: ProjectCopy;
  isFirst: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const fmt = useLocaleFormat();
  const tc = useTranslations("common");
  const accent = accentFor(projectIndex);
  const slideCount = project.gallery.length;
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <section ref={sectionRef} aria-label={copy.title} className="relative border-t border-border bg-surface">
      <div className="flex min-h-screen flex-col justify-center overflow-hidden py-8 md:py-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 md:px-10 lg:grid-cols-2 lg:gap-12">
          <div data-cursor="view" dir="ltr">
            <ProjectCarousel
              slides={project.gallery}
              url={project.id}
              accent={accent}
              sectionRef={sectionRef}
              scrollTriggerId={`project-${project.id}`}
              priority={isFirst}
              onSlideChange={setSlideIndex}
              prevLabel={tc("carouselPrev")}
              nextLabel={tc("carouselNext")}
              goToLabel={(n) => tc("carouselGoTo", { n: fmt.digits(n) })}
            />
          </div>

          <Card accent={accent} className="flex flex-col md:p-7">
            <div className="flex items-center gap-3">
              <span
                className="font-display text-3xl font-bold leading-none opacity-25"
                style={{ color: accents[accent].base }}
                aria-hidden
              >
                {fmt.index(projectIndex)}
              </span>
              <span className="eyebrow" style={{ color: accents[accent].base }}>
                {copy.category}
              </span>
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold leading-snug md:text-2xl">
              {copy.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
              {copy.description}
            </p>
            <ul className="mt-5 flex flex-col gap-2">
              {copy.story.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm text-foreground/80">
                  <span
                    className="mt-2 h-1 w-2.5 shrink-0 rounded-full"
                    style={{ background: accents[accent].base }}
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
            {copy.link && (
              <a
                href={copy.link}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="mt-5 inline-flex w-fit items-center gap-2 font-mono text-xs text-accent transition-colors hover:text-accent-secondary"
              >
                {copy.linkLabel ?? copy.link} ↗
              </a>
            )}
            <div className="mt-6 border-t border-border pt-4">
              <p className="eyebrow mb-2.5 text-muted">{tc("technologies")}</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-sm px-2 py-1 font-mono text-[10px] leading-none text-foreground/75"
                    style={{ background: accents[accent].soft }}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {slideCount > 1 && (
          <p className="mt-6 text-center font-mono text-[10px] tracking-wider text-muted">
            {tc("scrollGallery")}{" "}
            <span className="text-accent">
              {fmt.counter(slideIndex + 1, slideCount)}
            </span>
          </p>
        )}
      </div>
    </section>
  );
}

export function Projects() {
  const t = useTranslations("projects");
  const projectCopy = t.raw("items") as Record<string, ProjectCopy>;

  return (
    <div id="work" aria-label="Projects">
      <div className="border-t border-border bg-surface px-6 pb-8 pt-24 md:px-10 md:pt-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            number="03"
            label={t("label")}
            accent="caramel"
            title={t("title")}
            lead={t("subtitle")}
          />
        </div>
      </div>

      {projectsMeta.map((project, idx) => {
        const copy = projectCopy[project.id];
        if (!copy) return null;
        return (
          <ProjectPanel
            key={project.id}
            project={project}
            projectIndex={idx + 1}
            copy={copy}
            isFirst={idx === 0}
          />
        );
      })}
    </div>
  );
}
