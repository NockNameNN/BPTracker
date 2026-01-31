"use client";

import { TrackerProvider } from "@/context/TrackerContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TrackerProvider>{children}</TrackerProvider>;
}
