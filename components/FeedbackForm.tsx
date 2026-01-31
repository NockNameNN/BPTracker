"use client";

import { useState } from "react";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorText("");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorText(typeof data.error === "string" ? data.error : "Ошибка отправки");
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setErrorText("Ошибка сети");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="feedback-name" className="mb-1 block text-sm font-medium text-slate-300">
          Имя
        </label>
        <input
          id="feedback-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Как к вам обращаться"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          disabled={status === "sending"}
        />
      </div>
      <div>
        <label htmlFor="feedback-email" className="mb-1 block text-sm font-medium text-slate-300">
          Email
        </label>
        <input
          id="feedback-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Для ответа (необязательно)"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          disabled={status === "sending"}
        />
      </div>
      <div>
        <label htmlFor="feedback-message" className="mb-1 block text-sm font-medium text-slate-300">
          Сообщение <span className="text-amber-400">*</span>
        </label>
        <textarea
          id="feedback-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ваш вопрос или предложение"
          rows={5}
          required
          className="w-full resize-y rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          disabled={status === "sending"}
        />
      </div>
      {status === "error" && (
        <p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300">
          {errorText}
        </p>
      )}
      {status === "success" && (
        <p className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
          Сообщение отправлено. Спасибо!
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending" || !message.trim()}
        className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? "Отправка…" : "Отправить"}
      </button>
    </form>
  );
}
