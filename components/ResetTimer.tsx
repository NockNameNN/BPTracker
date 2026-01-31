"use client";

import { useEffect, useState } from "react";
import { useTracker } from "@/context/TrackerContext";
import { getMsUntilNextReset, formatTimeUntilReset } from "@/lib/time";

export function ResetTimer() {
  const [msLeft, setMsLeft] = useState(0);
  const { lastResetDate } = useTracker();

  useEffect(() => {
    const update = () => setMsLeft(getMsUntilNextReset());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastResetDate]);

  return (
    <div className="rounded-lg bg-amber-950/40 px-4 py-2 text-center font-mono text-amber-200">
      Сброс через: {formatTimeUntilReset(msLeft)} (00:00 МСК)
    </div>
  );
}
