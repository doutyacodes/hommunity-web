"use client";

import { Shield, LogOut } from "lucide-react";
import Link from "next/link";
import SidebarNav from "./sidebar-nav";

interface AdminSidebarProps {
  assignedBuildingName?: string;
  onClose?: () => void;
}

export default function AdminSidebar({ assignedBuildingName, onClose }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full text-slate-900 shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <Shield size={16} />
        </div>
        <span className="font-black text-sm tracking-wide font-headline">Local Admin</span>
      </div>

      <div className="flex-1 overflow-y-auto" onClick={() => onClose?.()}>
        <SidebarNav />
      </div>

      <div className="p-4 border-t border-slate-100 shrink-0">
        <div className="p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Assigned Building</p>
          <p className="text-xs font-black text-slate-900 truncate">{assignedBuildingName || "No Building Linked"}</p>
        </div>
        <Link 
          href="/login"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-600 font-bold hover:text-red-700 border border-transparent hover:border-red-200 transition-all text-sm group"
        >
          <LogOut size={16} className="text-slate-400 group-hover:text-red-600" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
