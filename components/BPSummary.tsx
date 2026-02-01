"use client";

interface BPSummaryProps {
  totalBp: number;
  maxBp: number;
  isVip: boolean;
  onVipChange: (v: boolean) => void;
}

export function BPSummary({ totalBp, maxBp, isVip, onVipChange }: BPSummaryProps) {
  return (
    <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg">
      <div className="mb-4 text-center">
        <span className="text-5xl font-bold tabular-nums text-amber-400">
          {totalBp}
        </span>
        {maxBp > 0 ? (
          <span className="ml-2 text-xl text-slate-400">/ {maxBp} BP сегодня</span>
        ) : (
          <span className="ml-2 text-xl text-slate-400">BP</span>
        )}
      </div>
      {maxBp > 0 && (
        <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(100, (totalBp / maxBp) * 100)}%`,
            }}
          />
        </div>
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={isVip}
          onChange={(e) => onVipChange(e.target.checked)}
          className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
        />
        <span className="text-slate-200">У меня VIP статус</span>
      </label>
    </div>
  );
}
