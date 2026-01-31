"use client";

import { TrackerProvider } from "@/context/TrackerContext";
import { SetupsProvider } from "@/context/SetupsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrackerProvider>
      <SetupsProvider>{children}</SetupsProvider>
    </TrackerProvider>
  );
}
