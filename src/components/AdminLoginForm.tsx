"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "登入失敗。");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md border border-white/10 bg-slate-950/70 p-6 sm:p-8">
      <h1 className="text-3xl font-black text-white sm:text-4xl">後台登入</h1>
      <label className="mt-8 block text-sm font-bold text-amber-200">
        使用者名稱
        <input value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-300" />
      </label>
      <label className="mt-5 block text-sm font-bold text-amber-200">
        密碼
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-amber-300" />
      </label>
      {error ? <p className="mt-4 text-red-200">{error}</p> : null}
      <button disabled={loading} className="mt-8 w-full bg-amber-300 px-6 py-4 text-xl font-black text-slate-950 disabled:opacity-60">
        {loading ? "登入中" : "登入"}
      </button>
    </form>
  );
}
