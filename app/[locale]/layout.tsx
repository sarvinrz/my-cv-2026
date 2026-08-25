import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import enMessages from "../../messages/en.json";
import faMessages from "../../messages/fa.json";
import "../globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const iranyekan = localFont({
  src: [
    {
      path: "../../public/fonts/iranyekan/IRANYekan-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekan-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/iranyekan/IRANYekan-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-iranyekan",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const catalog = locale === "fa" ? faMessages : enMessages;
  const title = `${site.name} — ${catalog.meta.role}`;

  return {
    title,
    description: catalog.meta.tagline,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fa: "/fa" },
    },
    openGraph: {
      title,
      description: catalog.meta.tagline,
      type: "website",
      url: `${site.url}/${locale}`,
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description: catalog.meta.tagline },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1014" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = locale === "fa" ? faMessages : enMessages;
  const dir = locale === "fa" ? "rtl" : "ltr";
  const fontVars = [sora.variable, jakarta.variable, jetbrains.variable, locale === "fa" ? iranyekan.variable : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${fontVars} h-full antialiased`}
    >
      <body className="grain min-h-full bg-background text-foreground">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
