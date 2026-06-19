"use client";

import { PRIZE_LABELS, type PrizeTier } from "@/lib/prize";

export type SpinResult = {
  result: "win" | "no_win";
  teamCode: string;
  teamName: string;
  prizeTier: PrizeTier;
  spinsUsed: number;
  spinsRemaining: number;
};

type ResultModalProps = {
  result: SpinResult | null;
  onClose: () => void;
};

export function ResultModal({ result, onClose }: ResultModalProps) {
  if (!result) return null;

  const isWin = result.result === "win" && result.prizeTier !== "none";
  const prizeLabel = isWin ? PRIZE_LABELS[result.prizeTier as keyof typeof PRIZE_LABELS] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020817]/90 px-4 backdrop-blur-md sm:px-8">
      <div className="w-full max-w-3xl border border-amber-300/60 bg-[#0b1830] p-6 text-center shadow-gold-glow sm:p-12">
        <div className="mb-4 text-5xl sm:text-7xl">{isWin ? "🏆" : "⚽"}</div>
        <p className="text-xl font-semibold text-amber-200">{result.teamCode} · {result.teamName}</p>
        <h2 className="mt-5 text-3xl font-black tracking-normal text-white sm:text-6xl">
          {isWin ? `恭喜獲得${prizeLabel}！` : "很遺憾，未中獎"}
        </h2>
        <p className="mt-6 text-lg text-slate-200 sm:text-2xl">
          {isWin
            ? "本次抽獎工作階段已結束"
            : result.spinsRemaining > 0
              ? `剩餘 ${result.spinsRemaining} 次機會`
              : "本次活動結束"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full bg-amber-300 px-8 py-4 text-xl font-bold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50 sm:mt-10 sm:w-auto sm:min-w-48"
        >
          {isWin || result.spinsRemaining === 0 ? "結束" : "再試一次"}
        </button>
      </div>
    </div>
  );
}
