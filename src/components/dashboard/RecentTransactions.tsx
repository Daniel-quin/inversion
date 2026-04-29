"use client";

import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { clsx } from "clsx";
import { formatCurrency } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";

export default function RecentTransactions() {
  const { transactions } = useInvestments();

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-slate-200/50">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
        <div>
          <h3 className="text-xl font-black text-slate-900">Transacciones Recientes</h3>
          <p className="text-sm text-slate-500 font-medium">Historial de movimientos de capital</p>
        </div>
        <button className="text-sm font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
          Ver Todo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black bg-slate-50/50">
              <th className="px-8 py-5">Nombre del Activo</th>
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Fecha</th>
              <th className="px-8 py-5 text-right">Monto</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-blue-50/30 transition-all duration-200 group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
                      t.amount < 0 ? "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
                    )}>
                      {t.amount < 0 ? (
                        <ArrowDownRight className="w-6 h-6" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-base leading-tight mb-1">{t.name}</p>
                      <p className="text-xs text-slate-400 font-bold">{t.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tight border border-slate-200/50">
                    {t.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-500 font-bold whitespace-nowrap">{t.date}</td>
                <td className={clsx(
                  "px-8 py-6 font-black text-lg text-right whitespace-nowrap",
                  t.amount < 0 ? "text-slate-900" : "text-emerald-500"
                )}>
                  {formatCurrency(t.amount, t.amount >= 0)}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-black text-slate-700">{t.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm">
                    <MoreHorizontal className="w-5 h-5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
