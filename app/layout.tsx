import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { PwaRegister } from "@/components/PwaRegister";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { TelegramWebAppInit } from "@/components/TelegramWebAppInit";
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
    default: "БП Гта 5 РП — трекер бонус поинтов (БП)",
    template: "%s | БП GTA 5 RP",
  },
  description:
    "Трекер бп для GTA 5 RP. Отслеживайте бонус поинты (БП) и ежедневные задания. Бп гта 5 рп, задания на бп.",
  keywords: [
    "бп гта 5 рп",
    "бп гта рп",
    "гта 5 рп бп",
    "бонус поинты гта",
    "трекер бп",
    "трекер бп гта",
    "ежедневные задания гта рп",
    "задания на бп",
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
    siteName: "БП Гта 5 РП — трекер",
    title: "БП Гта 5 РП — трекер бонус поинтов",
    description: "Трекер бп для GTA 5 RP. Бонус поинты, ежедневные задания. Бп гта 5 рп.",
  },
  twitter: {
    card: "summary_large_image",
    title: "БП Гта 5 РП — трекер бонус поинтов",
    description: "Трекер бп для GTA 5 RP. Ежедневные задания и бонус поинты. Бп гта 5 рп.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TelegramWebAppInit />
          <PwaRegister />
          {children}
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
