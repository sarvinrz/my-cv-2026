"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { scrollToY } from "@/lib/lenis-bridge";
import { consumeScrollPosition } from "@/lib/scroll-preserve";

/** Restores scroll after locale switch (saved by LocaleSwitcher). */
export function ScrollRestore() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const y = consumeScrollPosition();
    if (y == null) return;

    const restore = () => {
      scrollToY(y);
      ScrollTrigger.refresh(true);
    };

    restore();
    requestAnimationFrame(restore);
    const t1 = window.setTimeout(restore, 80);
    const t2 = window.setTimeout(restore, 280);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [locale]);

  return null;
}
