"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  Briefcase, 
  LineChart, 
  Settings, 
  LogOut,
  TrendingUp
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Panel de Control", href: "/" },
  { icon: Wallet, label: "Gestión de Capital", href: "/capital" },
  { icon: Briefcase, label: "Portafolio", href: "/portfolio" },
  { icon: LineChart, label: "Rentabilidad", href: "/roi" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-72 glass-sidebar flex flex-col h-full z-20">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            WealthPort
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <item.icon className={clsx(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500"
                )} />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <button className="flex items-center gap-4 px-4 py-3 w-full text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-bold">Configuración</span>
        </button>
        
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-inner">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900">{user?.name}</span>
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider leading-none mt-1">{user?.role}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-rose-50 rounded-lg transition-colors group ml-auto"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
