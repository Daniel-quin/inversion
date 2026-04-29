"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from "recharts";
import { 
  Download, 
  Calendar,
  TrendingUp,
  PieChart as PieChartIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { useInvestments } from "@/context/InvestmentContext";
import { formatCurrency, formatPercent } from "@/lib/utils";

// Estos datos mensuales se generarán dinámicamente cuando el usuario tenga historial
const emptyData = [
  { name: "ENE", ganancias: 0, perdidas: 0 },
  { name: "FEB", ganancias: 0, perdidas: 0 },
  { name: "MAR", ganancias: 0, perdidas: 0 },
  { name: "ABR", ganancias: 0, perdidas: 0 },
  { name: "MAY", ganancias: 0, perdidas: 0 },
  { name: "JUN", ganancias: 0, perdidas: 0 },
  { name: "JUL", ganancias: 0, perdidas: 0 },
];

export default function ROIPage() {
  const { investments, totalInvertido } = useInvestments();

  // Calcular distribución real para el gráfico circular
  const allocationData = investments.reduce((acc: any[], inv) => {
    const existing = acc.find(item => item.label === inv.category);
    if (existing) {
      existing.value += inv.monto;
    } else {
      acc.push({ label: inv.category, value: inv.monto, color: 'bg-slate-900' });
    }
    return acc;
  }, []);

  const totalAssets = totalInvertido;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Análisis de Rentabilidad</h1>
          <p className="text-slate-500 font-bold">Métricas de rendimiento institucional y desempeño P/L real.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-sm shadow-lg">
            <Calendar className="w-4 h-4" />
            Últimos 12 Meses
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-sm shadow-sm hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Exportar Informe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-[2rem] shadow-2xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-slate-900">Rendimiento de Ganancias</h3>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ganancias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pérdidas</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emptyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(226, 232, 240, 0.5)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="ganancias" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="perdidas" fill="#EF4444" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-200/50">
          <div className="relative w-56 h-56 mb-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className={clsx("text-slate-100", totalAssets === 0 && "opacity-20")} />
              {totalAssets > 0 && (
                <circle cx="112" cy="112" r="95" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-900" strokeDasharray="596.9" strokeDashoffset="0" />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-800 tracking-tight">{formatCurrency(totalAssets)}</span>
              <span className="text-[7px] uppercase font-bold text-slate-400 tracking-[0.4em] mt-0.5">Activos Totales</span>
            </div>
          </div>
          
          <h3 className="text-xl font-black text-slate-900 mb-8">Distribución de Activos</h3>
          <div className="w-full space-y-5">
            {allocationData.length > 0 ? allocationData.map((item: any) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-slate-900 shadow-sm`} />
                  <span className="font-bold text-slate-500">{item.label}</span>
                </div>
                <span className="font-black text-slate-900">{((item.value / totalAssets) * 100).toFixed(1)}%</span>
              </div>
            )) : (
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin activos registrados</p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/40">
          <h3 className="text-2xl font-black text-slate-900">Desglose de rendimiento por fuente</h3>
          <div className="flex items-center gap-2 text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-black shadow-sm">
            <TrendingUp className="w-4 h-4" />
            Sin rendimiento histórico
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {investments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6">Fuente de Inversión</th>
                  <th className="px-10 py-6 text-right">Capital Asignado</th>
                  <th className="px-10 py-6 text-right">Valor Actual</th>
                  <th className="px-10 py-6 text-right">P/L No Realizado</th>
                  <th className="px-10 py-6 text-center">Rendimiento (Anual)</th>
                  <th className="px-10 py-6">Tendencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {investments.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition-all duration-300">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shadow-sm">
                          <PieChartIcon className="w-6 h-6 text-slate-500" />
                        </div>
                        <span className="font-black text-slate-900 text-base">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-bold text-slate-500 text-base text-right whitespace-nowrap">
                      {formatCurrency(s.monto)}
                    </td>
                    <td className="px-10 py-8 font-black text-slate-900 text-lg text-right whitespace-nowrap">
                      {formatCurrency(s.valor)}
                    </td>
                    <td className={clsx(
                      "px-10 py-8 font-black text-lg text-right whitespace-nowrap",
                      (s.valor - s.monto) >= 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {formatCurrency(s.valor - s.monto, true)}
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-center">
                        <span className={clsx(
                          "px-4 py-1.5 rounded-xl text-xs font-black shadow-sm border",
                          s.roi >= 0 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                        )}>
                          {formatPercent(s.roi)}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="w-24 h-1 px-4 bg-slate-100 rounded-full relative overflow-hidden">
                        <div 
                          className={clsx(
                            "absolute top-0 left-0 h-full transition-all duration-1000",
                            s.roi >= 0 ? "bg-emerald-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${Math.min(Math.abs(s.roi), 100)}%` }} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <PieChartIcon className="w-8 h-8" />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">No hay activos para analizar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
