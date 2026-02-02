"use client";

import { useEffect } from "react";

export function TelegramWebAppInit() {
  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    webApp.ready();
    webApp.expand();
    webApp.setHeaderColor("#0f172a");
    webApp.setBackgroundColor("#0f172a");
  }, []);

  return null;
}
