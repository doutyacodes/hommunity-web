import { SuperadminSidebar } from "@/components/superadmin-sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SuperadminSidebar />
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen pb-10">
        {children}
      </div>
    </div>
  );
}
