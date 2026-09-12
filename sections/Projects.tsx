"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { projectsMeta, type ProjectMeta } from "@/lib/site";
import { useLocaleFormat } from "@/lib/format";
import { ProjectCarousel } from "@/components/ui/ProjectCarousel";
import { SectionHeading } from "@/components/ui/Section";
import { Card, Chip } from "@/components/ui/Card";
import { accentFor, accents } from "@/lib/design-tokens";

type ProjectLink = { href: string; label: string };

type ProjectCopy = {
  title: string;
  category: string;
  description: string;
  story?: string[];
  link?: string;
  linkLabel?: string;
  links?: ProjectLink[];
};

function ProjectDetailCard({
  project,
  projectIndex,
  copy,
  accent,
}: {
  project: ProjectMeta;
  projectIndex: number;
  copy: ProjectCopy;
  accent: ReturnType<typeof accentFor>;
}) {
  const tc = useTranslations("common");
  const fmt = useLocaleFormat();

  const extraLinks = copy.links ?? [];
  const demoHref = copy.link;

  return (
    <Card accent={accent} interactive={false} padded={false} className="flex w-full flex-col p-4 sm:p-5 lg:p-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className="font-display text-2xl font-bold leading-none opacity-25 lg:text-3xl"
          style={{ color: accents[accent].base }}
          aria-hidden
        >
          {fmt.index(projectIndex)}
        </span>
        <span className="eyebrow" style={{ color: accents[accent].base }}>
          {copy.category}
        </span>
        {project.kind === "featured" ? (
          <Chip accent={accent} mono={false}>
            {tc("featured")}
          </Chip>
        ) : project.kind === "satellite" ? (
          <Chip accent={accent} mono={false}>
            {tc("satellite")}
          </Chip>
        ) : project.kind === "personal" ? (
          <Chip accent={accent} mono={false}>
            {tc("personal")}
          </Chip>
        ) : null}
      </div>

      <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug lg:text-xl">
        {copy.title}
      </h3>
      <p className="mt-2 text-[13px] leading-snug text-muted lg:text-sm lg:leading-relaxed">
        {copy.description}
      </p>

      {(copy.story ?? []).length > 0 ? (
        <ul className="mt-2.5 flex flex-col gap-1.5 border-t border-border pt-2.5">
          {(copy.story ?? []).map((line) => (
            <li key={line} className="flex gap-2 text-[13px] leading-snug text-foreground/80 lg:text-sm">
              <span
                className="mt-1.5 h-1 w-2 shrink-0 rounded-full"
                style={{ background: accents[accent].base }}
                aria-hidden
              />
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      {(demoHref || extraLinks.length > 0) && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {demoHref ? (
            <a
              href={demoHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="rounded-md border border-border px-3 py-1.5 font-mono text-[10px] text-accent transition-colors hover:border-accent hover:text-accent-secondary"
            >
              {copy.linkLabel ?? tc("liveDemo")} ↗
            </a>
          ) : null}
          {extraLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="rounded-md border border-border px-3 py-1.5 font-mono text-[10px] text-accent transition-colors hover:border-accent hover:text-accent-secondary"
            >
              {item.label} ↗
            </a>
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-border pt-2.5">
        <p className="eyebrow mb-1.5 text-muted">{tc("technologies")}</p>
        <ul className="flex flex-wrap gap-1">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded-sm px-2 py-0.5 font-mono text-[9px] leading-none text-foreground/75 lg:text-[10px]"
              style={{ background: accents[accent].soft }}
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

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

  return (
    <section ref={sectionRef} aria-label={copy.title} className="relative border-t border-border bg-surface">
      <div className="relative flex flex-col justify-center overflow-hidden py-12 md:py-16">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 sm:px-6 md:px-10">
          <div className="grid w-full items-center gap-5 lg:grid-cols-2 lg:gap-8">
            <div data-cursor="view" dir="ltr" className="min-h-0 w-full self-center">
              <ProjectCarousel
                key={`${project.id}-${project.gallery.length}`}
                slides={project.gallery}
                url={project.id}
                accent={accent}
                sectionRef={sectionRef}
                scrollTriggerId={`project-${project.id}`}
                priority={isFirst}
                prevLabel={tc("carouselPrev")}
                nextLabel={tc("carouselNext")}
                goToLabel={(n) => tc("carouselGoTo", { n: fmt.digits(n) })}
                expandLabel={tc("expandPreview")}
                collapseLabel={tc("collapsePreview")}
                expandHint={tc("expandHint")}
              />
            </div>

            <div className="flex min-h-0 items-center self-center">
              <ProjectDetailCard
                project={project}
                projectIndex={projectIndex}
                copy={copy}
                accent={accent}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const t = useTranslations("projects");
  const projectCopy = t.raw("items") as Record<string, ProjectCopy>;

  return (
    <div id="work" aria-label="Projects">
      <div className="border-t border-border bg-surface px-6 pb-4 pt-14 md:px-10 md:pb-6 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            number="02"
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
          <ProjectPanel key={project.id} project={project} projectIndex={idx + 1} copy={copy} isFirst={idx === 0} />
        );
      })}
    </div>
  );
}
