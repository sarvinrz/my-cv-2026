"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const next = locale === "en" ? "fa" : "en";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      className="flex h-9 items-center rounded-md border border-border bg-surface-elevated px-3 font-mono text-[11px] tracking-wider text-foreground/70 transition-colors duration-[--d-fast] hover:border-accent hover:text-accent"
      aria-label={locale === "en" ? "Switch to Persian" : "Switch to English"}
    >
      {locale === "en" ? "FA" : "EN"}
    </button>
  );
}
