"use client";

import { useEffect, useState } from "react";

export function useTelegramWebApp() {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    const webApp = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
    setIsMiniApp(Boolean(webApp));
  }, []);

  return {
    isMiniApp,
    webApp: typeof window !== "undefined" ? window.Telegram?.WebApp : undefined,
  };
}
