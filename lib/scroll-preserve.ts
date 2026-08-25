import { getScrollY } from "@/lib/lenis-bridge";

const SCROLL_KEY = "cv-scroll-y";

export function saveScrollPosition() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SCROLL_KEY, String(getScrollY()));
}
export function consumeScrollPosition(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SCROLL_KEY);
  sessionStorage.removeItem(SCROLL_KEY);
  if (!raw) return null;
  const y = Number(raw);
  return Number.isFinite(y) ? y : null;
}
