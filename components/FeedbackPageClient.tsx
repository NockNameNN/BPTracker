"use client";

import Link from "next/link";
import { FeedbackForm } from "./FeedbackForm";

export function FeedbackPageClient() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          На главную
        </Link>
        <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg">
          <h1 className="mb-2 text-2xl font-bold text-white">Обратная связь</h1>
          <p className="mb-6 text-slate-400">
            Вопросы, предложения или баги.
          </p>
          <FeedbackForm />
        </div>
      </div>
    </main>
  );
}
