"use client";

import { 
  Plus, 
  ChevronDown,
  ArrowUpRight,
  Zap,
  Dna,
  Building2,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
  PieChart as PieChartIcon,
  Briefcase
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useInvestments, Investment } from "@/context/InvestmentContext";
import { clsx } from "clsx";
import Modal from "@/components/Modal";
import UpdateValueForm from "@/components/forms/UpdateValueForm";
import InvestmentForm from "@/components/forms/InvestmentForm";
import { useState, useEffect } from "react";

const iconMap: any = {
  Zap,
  Dna,
  Building2,
  Briefcase
};

export default function PortfolioPage() {
  const { 
    investments, 
    totalInvertido, 
    gananciaTotal, 
    roiGlobal, 
    isLoaded,
    efectivoDisponible 
  } = useInvestments();
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Efecto para manejar el estado de carga local de forma segura
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setLocalLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  if (!isLoaded || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando Activos...</p>
        </div>
      </div>
    );
  }

  const handleUpdateClick = (inv: Investment) => {
    setSelectedInvestment(inv);
    setIsUpdateModalOpen(true);
  };

  // Calcular distribución real con salvaguardas
  const allocationData = (investments || []).reduce((acc: any[], inv) => {
    if (!inv) return acc;
    const cat = inv.category || "Otros";
    const existing = acc.find(item => item.label === cat);
    if (existing) {
      existing.value += (inv.monto || 0);
    } else {
      acc.push({ label: cat, value: (inv.monto || 0) });
    }
    return acc;
  }, []);

  const safeTotalInvertido = totalInvertido || 0;
  const safeGananciaTotal = gananciaTotal || 0;
  const safeEfectivo = efectivoDisponible || 0;
  
  // El patrimonio real es lo que tengo invertido (valor actual) + lo que tengo en efectivo
  const totalPatrimonio = (safeTotalInvertido + safeGananciaTotal) + safeEfectivo;

  return (
    <div className="space-y-8 pb-12">
      {/* Modal: Actualizar Valor */}
      {selectedInvestment && (
        <Modal 
          isOpen={isUpdateModalOpen} 
          onClose={() => setIsUpdateModalOpen(false)} 
          title="Actualizar Valuación"
        >
          <UpdateValueForm 
            investment={selectedInvestment} 
            onSuccess={() => setIsUpdateModalOpen(false)} 
          />
        </Modal>
      )}

      {/* Modal: Añadir Inversión */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Registrar Nueva Inversión"
      >
        <InvestmentForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portafolio de Inversiones</h1>
          <p className="text-slate-500 font-bold">Valuación en tiempo real y análisis de rendimiento de activos.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-black text-sm shadow-sm hover:bg-slate-50 transition-all">
            Exportar Informe
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-sm shadow-lg shadow-slate-900/10 hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Añadir Inversión
          </button>
        </div>
      </div>

      <div className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-200/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-3xl -mr-40 -mt-40" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center relative z-10">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase font-black tracking-[0.25em] text-slate-400 mb-3">Valor Total del Patrimonio</p>
            <div className="flex items-baseline gap-4 mb-10">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{formatCurrency(totalPatrimonio)}</h2>
              {totalPatrimonio > 0 && (
                <span className={clsx(
                  "font-black flex items-center px-3 py-1.5 rounded-xl text-sm border",
                  gananciaTotal >= 0 ? "text-emerald-500 bg-emerald-50 border-emerald-100" : "text-rose-500 bg-rose-50 border-rose-100"
                )}>
                  {gananciaTotal >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                  {roiGlobal.toFixed(2)}%
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capital Comprometido</p>
                <p className="text-xl font-black text-slate-800">{formatCurrency(totalInvertido)}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ganancias No Realizadas</p>
                <p className={clsx("text-xl font-black", gananciaTotal >= 0 ? "text-emerald-500" : "text-rose-500")}>
                  {formatCurrency(gananciaTotal, true)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alfa del Portafolio</p>
                <p className="text-xl font-black text-slate-800">{roiGlobal.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex justify-end">
            <div className="flex items-center gap-16">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="14" fill="transparent" className={clsx("text-slate-100", totalInvertido === 0 && "opacity-20")} />
                  {totalInvertido > 0 && (
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-900" strokeDasharray="439.8" strokeDashoffset="0" />
                  )}
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900">{investments.length}</span>
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Activos</span>
                </div>
              </div>
              <div className="space-y-4">
                {allocationData.length > 0 ? allocationData.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-slate-900 shadow-sm" />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900">{item.label}</span>
                      <span className="text-[10px] font-bold text-slate-400">{((item.value / totalInvertido) * 100).toFixed(0)}% de asignación</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin asignación</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/40">
          <h3 className="text-2xl font-black text-slate-900">Tenencias Detalladas</h3>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-black">
              Todos los Sectores <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[300px]">
          {investments.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black bg-slate-50/50">
                <tr>
                  <th className="px-10 py-6">Nombre del Activo</th>
                  <th className="px-10 py-6">Categoría</th>
                  <th className="px-10 py-6 text-right">Monto Inicial</th>
                  <th className="px-10 py-6 text-right">Valor Actual</th>
                  <th className="px-10 py-6 text-center">ROI Mensual</th>
                  <th className="px-10 py-6">Estado</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {investments.map((inv) => {
                  const Icon = iconMap[inv.icon] || Briefcase;
                  return (
                    <tr key={inv.id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-tight mb-1">{inv.name}</p>
                            <p className="text-xs text-slate-400 font-bold">{inv.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-tight border border-slate-200/50">
                          {inv.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 font-bold text-slate-500 text-base text-right whitespace-nowrap">
                        {formatCurrency(inv.monto)}
                      </td>
                      <td className="px-10 py-8 font-black text-slate-900 text-xl text-right whitespace-nowrap">
                        {formatCurrency(inv.valor)}
                      </td>
                      <td className="px-10 py-8">
                        <div className={`flex items-center justify-center gap-1 font-black text-lg ${
                          inv.roi > 0 ? 'text-emerald-500' : 'text-slate-400'
                        } whitespace-nowrap`}>
                          {formatPercent(inv.roi)}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                          <span className="text-xs font-black text-slate-700">{inv.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => handleUpdateClick(inv)}
                          className="p-3 hover:bg-slate-900 group/btn rounded-2xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
                        >
                          <TrendingUp className="w-6 h-6 text-slate-400 group-hover/btn:text-white transition-colors" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-24 space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Briefcase className="w-8 h-8" />
              </div>
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">No hay tenencias registradas</p>
            </div>
          )}
        </div>
        
        <div className="p-10 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mostrando {investments.length} activos registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl flex items-center gap-5 border-l-4 border-l-slate-200 opacity-60">
          <div className="p-4 rounded-2xl bg-slate-50 text-slate-400">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Rendimiento Mensual</p>
            <p className="text-2xl font-black text-slate-300">$0</p>
          </div>
        </div>
        
        <div className="glass-card p-8 rounded-3xl flex items-center gap-5 border-l-4 border-l-slate-200 opacity-60">
          <div className="p-4 rounded-2xl bg-slate-50 text-slate-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Exposición al Riesgo</p>
            <p className="text-2xl font-black text-slate-300">Pendiente</p>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl flex items-center gap-5 border-l-4 border-l-slate-200 opacity-60">
          <div className="p-4 rounded-2xl bg-slate-50 text-slate-400">
            <PieChartIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Sector Principal</p>
            <p className="text-2xl font-black text-slate-300">Ninguno</p>
          </div>
        </div>
      </div>
    </div>
  );
}
