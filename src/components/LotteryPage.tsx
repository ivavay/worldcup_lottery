"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { WorldCupRoulette } from "./Roulette";
import { ResultModal, type SpinResult } from "./ResultModal";
import { TEAMS } from "@/lib/teams";

type PoolStatus = {
  isConfigured: boolean;
  firstPrizeRemaining: number;
  secondPrizeRemaining: number;
  thirdPrizeRemaining: number;
};

type SessionStatus = {
  spinsUsed: number;
  spinsRemaining: number;
  hasWon: boolean;
  prizeTier: string | null;
};

export function LotteryPage() {
  const [pool, setPool] = useState<PoolStatus | null>(null);
  const [session, setSession] = useState<SessionStatus | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [pendingResult, setPendingResult] = useState<SpinResult | null>(null);
  const [visibleResult, setVisibleResult] = useState<SpinResult | null>(null);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const [poolRes, sessionRes] = await Promise.all([
      fetch("/api/prize-pool/status", { cache: "no-store" }),
      fetch("/api/session/status", { cache: "no-store" }),
    ]);
    setPool(await poolRes.json());
    setSession(await sessionRes.json());
  }, []);

  useEffect(() => {
    // Initial API synchronization for the browser-bound lottery session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch(() => setError("系統狀態讀取失敗，請重新整理頁面。"));
  }, [refresh]);

  const disabled = useMemo(
    () => !pool?.isConfigured || !session || session.hasWon || session.spinsRemaining <= 0 || spinning,
    [pool, session, spinning],
  );

  async function spin() {
    if (disabled) return;
    setError("");
    const res = await fetch("/api/spin", { method: "POST" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "抽獎失敗，請稍後再試。");
      await refresh();
      return;
    }

    const teamIndex = Math.max(0, TEAMS.findIndex((team) => team.code === body.teamCode));
    setPrizeNumber(teamIndex);
    setPendingResult(body);
    setSpinning(true);
  }

  async function handleStop() {
    setSpinning(false);
    setVisibleResult(pendingResult);
    setPendingResult(null);
    await refresh();
  }

  const dots = Array.from({ length: 3 }, (_, index) => index < (session?.spinsRemaining ?? 3));

  return (
    <main className="stadium-grid min-h-screen overflow-hidden bg-[#071323]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-12 py-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-base font-bold uppercase tracking-[0.35em] text-emerald-300">FIFA World Cup 2026</p>
            <h1 className="mt-2 text-5xl font-black tracking-normal text-white">2026 世界盃抽獎活動</h1>
          </div>
          <div className="border border-amber-300/50 px-6 py-3 text-right">
            <p className="text-sm text-amber-200">本次活動由俱樂部舉辦</p>
            <p className="mt-1 text-2xl font-black text-amber-300">剩餘次數：{session?.spinsRemaining ?? 3}</p>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-[1fr_340px] items-center gap-10 py-10">
          <div className="flex justify-center">
            <WorldCupRoulette mustStartSpinning={spinning} prizeNumber={prizeNumber} onStopSpinning={handleStop} />
          </div>

          <aside className="border-l border-white/10 pl-8">
            <div className="mb-8 flex gap-3">
              {dots.map((active, index) => (
                <span
                  key={index}
                  className={`h-8 w-8 rounded-full border-2 ${active ? "border-amber-300 bg-amber-300 shadow-gold-glow" : "border-slate-500 bg-slate-800"}`}
                  aria-label={active ? "剩餘機會" : "已使用機會"}
                />
              ))}
            </div>

            {!pool?.isConfigured ? (
              <p className="mb-6 border border-red-300/40 bg-red-950/40 p-5 text-xl font-semibold text-red-100">
                管理員尚未設定獎池，暫無法抽獎
              </p>
            ) : null}

            {error ? <p className="mb-6 border border-red-300/40 bg-red-950/40 p-4 text-red-100">{error}</p> : null}

            <button
              type="button"
              disabled={disabled}
              onClick={spin}
              className="w-full bg-amber-300 px-8 py-5 text-2xl font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              開始抽獎
            </button>

            <div className="mt-8 grid gap-3 text-lg text-slate-200">
              <p>一等獎剩餘：<span className="font-bold text-amber-200">{pool?.firstPrizeRemaining ?? 0}</span></p>
              <p>二等獎剩餘：<span className="font-bold text-amber-200">{pool?.secondPrizeRemaining ?? 0}</span></p>
              <p>三等獎剩餘：<span className="font-bold text-amber-200">{pool?.thirdPrizeRemaining ?? 0}</span></p>
            </div>
          </aside>
        </div>
      </section>

      <ResultModal result={visibleResult} onClose={() => setVisibleResult(null)} />
    </main>
  );
}
