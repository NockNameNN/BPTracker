"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900">
      <p className="text-slate-400">Переход на главную…</p>
    </main>
  );
}
