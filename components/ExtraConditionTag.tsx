"use client";

export function ExtraConditionTag({ text }: { text: string }) {
  return (
    <span className="group relative inline-block">
      <span className="cursor-help rounded bg-sky-600/30 px-1.5 py-0.5 text-xs text-sky-300">
        Доп. условия
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 max-w-[240px] -translate-x-1/2 rounded bg-slate-800 px-2 py-1.5 text-xs text-slate-200 opacity-0 shadow-lg ring-1 ring-slate-600 transition-opacity group-hover:opacity-100"
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
