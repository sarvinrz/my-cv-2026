"use client";

import type { CSSProperties, ReactNode } from "react";
import { accents, type AccentName } from "@/lib/design-tokens";

/**
 * The single card recipe for the whole site.
 *
 * Radius, border, shadow, hover lift and the tinted accent wash all live
 * in the `.card` rules in globals.css. A component only ever chooses an
 * accent name — never a raw colour.
 */
export function Card({
  accent = "sky",
  interactive = true,
  padded = true,
  as: Tag = "div",
  className = "",
  style,
  children,
  ...rest
}: {
  accent?: AccentName;
  interactive?: boolean;
  padded?: boolean;
  as?: "div" | "article" | "li" | "section";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag
      className={[
        "card",
        interactive ? "card-interactive" : "",
        padded ? "p-5 md:p-6" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ["--card-accent" as string]: accents[accent].base, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Small monospaced pill used for tech names, levels and metadata. */
export function Chip({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  accent?: AccentName;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-[10px] tracking-wider ${className}`}
      style={
        accent
          ? {
              borderColor: `color-mix(in srgb, ${accents[accent].base} 45%, transparent)`,
              background: accents[accent].soft,
              color: "var(--foreground)",
            }
          : { borderColor: "var(--border)", color: "var(--muted)" }
      }
    >
      {children}
    </span>
  );
}
