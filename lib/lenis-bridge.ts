import type Lenis from "lenis";

let lenis: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenis = instance;
}

export function getLenisInstance() {
  return lenis;
}

export function getScrollY() {
  if (typeof window === "undefined") return 0;
  return lenis?.scroll ?? window.scrollY;
}

export function scrollToY(y: number) {
  if (typeof window === "undefined") return;
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
}
