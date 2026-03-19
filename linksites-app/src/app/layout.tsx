import type { Metadata } from "next";
import { appContent } from "@/data/app-content";
import { getServerLocale } from "@/lib/locale-server";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const content = appContent[locale];

  return {
    title: content.metadata.title,
    description: content.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getServerLocale();
  const content = appContent[locale];

  return (
    <html lang={content.lang} className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
