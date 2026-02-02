import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PwaRegister } from "@/components/PwaRegister";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bp-tracker.example.com";

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BP Tracker — GTA 5 RP Bonus Points",
    template: "%s | BP Tracker",
  },
  description:
    "Отслеживание ежедневных заданий для получения Bonus Points в GTA 5 RolePlay",
  keywords: [
    "GTA 5",
    "GTA RP",
    "RolePlay",
    "Bonus Points",
    "BP",
    "ежедневные задания",
    "трекер",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: baseUrl,
    siteName: "BP Tracker",
    title: "BP Tracker — GTA 5 RP Bonus Points",
    description: "Отслеживание ежедневных заданий для получения Bonus Points в GTA 5 RolePlay",
  },
  twitter: {
    card: "summary_large_image",
    title: "BP Tracker — GTA 5 RP Bonus Points",
    description: "Отслеживание ежедневных заданий для получения Bonus Points в GTA 5 RolePlay",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PwaRegister />
          {children}
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
