"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "bp-tracker-cookie-consent";
const GTAG_ID = "G-KSCNEJLQ7D";

function loadGtag() {
  if (typeof window === "undefined") return;
  const s1 = document.createElement("script");
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
  document.head.appendChild(s1);
  const s2 = document.createElement("script");
  s2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GTAG_ID}', { anonymize_ip: true, allow_google_signals: false });
  `;
  document.head.appendChild(s2);
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      loadGtag();
      return;
    }
    if (consent === "rejected") return;
    setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    loadGtag();
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-600 bg-slate-800 px-4 py-4 shadow-lg sm:px-6"
      role="dialog"
      aria-label="Согласие на использование cookie"
    >
      <div className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Мы используем cookie для аналитики. Продолжая пользоваться сайтом, вы соглашаетесь с этим.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700"
          >
            Отклонить
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-400"
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}
