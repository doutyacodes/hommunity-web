import { BuildingSidebar } from "@/components/building-sidebar";

const buildingNames: Record<string, string> = {
  "1": "Maple Heights",
  "2": "Crystal Tower",
  "3": "Sunrise Complex",
  "4": "Harbor View",
};

export default async function BuildingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buildingName = buildingNames[id] ?? "Building";

  return (
    <div className="flex h-screen bg-[#131313] overflow-hidden">
      <BuildingSidebar buildingId={id} buildingName={buildingName} />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Top header */}
        <header className="h-16 bg-[#131313]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)] flex items-center justify-between px-8 shrink-0 z-30">
          <div>
            <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-widest">Building Console</p>
            <h1
              className="text-sm font-black text-[#a4c9ff] tracking-tight leading-none font-headline"
            >
              {buildingName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                placeholder="Search parameters..."
                className="bg-[#353534] border-0 rounded-lg pl-9 pr-4 py-2 text-xs text-[#e5e2e1] placeholder:text-[#8b919d]/60 focus:ring-1 focus:ring-[#a4c9ff]/40 outline-none w-52 transition-all"
              />
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b919d] text-base">
                search
              </span>
            </div>
            <button className="p-2 text-[#8b919d] hover:bg-white/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="p-2 text-[#8b919d] hover:bg-white/5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
        </header>

        {/* Main scrollable content */}
        <main className="flex-1 overflow-auto scrollbar-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
