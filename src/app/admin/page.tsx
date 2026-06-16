import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/AdminPanel";
import { isAdminAuthenticated } from "@/lib/session";

export const runtime = "nodejs";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return <AdminPanel />;
}
