import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getAdminByUsername } from "./supabase-db";

const SPIN_COOKIE = "wc_spin_session";
const ADMIN_COOKIE = "wc_admin_session";
const SECRET = process.env.SESSION_SECRET ?? "worldcup-lottery-local-secret";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function getSpinSessionId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SPIN_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  cookieStore.set(SPIN_COOKIE, sessionId, cookieOptions);
  return sessionId;
}

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, `${username}.${sign(username)}`, cookieOptions);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const [username, signature] = value.split(".");
  if (!username || signature !== sign(username)) return false;

  const admin = await getAdminByUsername(username);
  return Boolean(admin);
}
