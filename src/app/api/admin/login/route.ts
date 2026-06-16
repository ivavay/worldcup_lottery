import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { setAdminSession } from "@/lib/session";

export const runtime = "nodejs";

type AdminRow = {
  username: string;
  password_hash: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  if (!body?.username || !body.password) {
    return Response.json({ error: "請輸入使用者名稱與密碼。" }, { status: 400 });
  }

  const admin = getDb()
    .prepare("SELECT username, password_hash FROM admins WHERE username = ?")
    .get(body.username) as AdminRow | undefined;

  if (!admin || !bcrypt.compareSync(body.password, admin.password_hash)) {
    return Response.json({ error: "帳號或密碼錯誤。" }, { status: 401 });
  }

  await setAdminSession(admin.username);
  return Response.json({ success: true });
}
