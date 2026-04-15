"use client";

import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import AdminSidebar from "./admin-sidebar";

interface MobileHeaderProps {
  assignedBuildingName?: string;
}

export default function MobileHeader({ assignedBuildingName }: MobileHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Top Header Bar */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <Shield size={16} />
          </div>
          <span className="font-black text-xs tracking-wide font-headline uppercase">Hommunity Admin</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Drawer Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-[70] animate-in slide-in-from-left duration-300">
            <div className="relative h-full">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 -right-12 p-2 bg-white rounded-r-xl text-slate-600 shadow-md lg:hidden"
              >
                <X size={20} />
              </button>
              <AdminSidebar assignedBuildingName={assignedBuildingName} onClose={() => setIsOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
