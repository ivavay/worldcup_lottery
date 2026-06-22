import bcrypt from "bcryptjs";
import { setAdminSession } from "@/lib/session";
import { getAdminByUsername } from "@/lib/supabase-db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { username?: string; password?: string } | null;
  if (!body?.username || !body.password) {
    return Response.json({ error: "請輸入使用者名稱與密碼。" }, { status: 400 });
  }

  const admin = await getAdminByUsername(body.username);

  if (!admin || !bcrypt.compareSync(body.password, admin.password_hash)) {
    return Response.json({ error: "帳號或密碼錯誤。" }, { status: 401 });
  }

  await setAdminSession(admin.username);
  return Response.json({ success: true });
}
