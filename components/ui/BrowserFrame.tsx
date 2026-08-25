import type { ReactNode } from "react";

interface BrowserFrameProps {
  url: string;
  children: ReactNode;
  className?: string;
}

export function BrowserFrame({ url, children, className = "" }: BrowserFrameProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-lg ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface px-3 py-2">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded bg-background/60 px-2 py-0.5 font-mono text-[9px] tracking-wider text-muted sm:text-[10px]">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
