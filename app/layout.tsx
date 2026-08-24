import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Root pass-through — the real html/body live in app/[locale]/layout.tsx.
 * metadataBase is declared here so routes outside the locale segment
 * (the OG image and the not-found page) resolve absolute URLs too.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
