import { SuperadminSidebar } from "@/components/superadmin-sidebar";

export default function BuildingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SuperadminSidebar />
      <div className="flex-1 lg:pl-12 flex flex-col min-h-screen pt-16 lg:pt-0 pb-10">
        {children}
      </div>
    </div>
  );
}
