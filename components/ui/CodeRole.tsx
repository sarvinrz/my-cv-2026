"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CodeRole({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced) {
      setShown(text);
      return;
    }

    setShown("");
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(tick);
    }, 70);

    return () => window.clearInterval(tick);
  }, [reduced, text]);

  return (
    <p
      data-code-role
      className="mt-2 inline-block font-mono text-lg sm:text-xl"
      aria-label={`< ${text} />`}
      dir="ltr"
    >
      <span className="text-accent-secondary">&lt; </span>
      <span className="text-foreground">
        {shown}
        <span
          aria-hidden
          className="ms-1 inline-block h-[1em] w-[2px] align-middle bg-accent animate-blink"
        />
      </span>
      <span className="text-accent-secondary"> /&gt;</span>
    </p>
  );
}
