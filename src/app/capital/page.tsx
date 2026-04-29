"use client";

import { useState } from "react";
import { 
  CircleDollarSign,
  TrendingUp,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";
import Modal from "@/components/Modal";
import TransactionForm from "@/components/forms/TransactionForm";
import { clsx } from "clsx";

export default function CapitalPage() {
  const { 
    capitalInicial, 
    transactions, 
    totalInvertido, 
    efectivoDisponible 
  } = useInvestments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalOpen] = useState<"Entrada" | "Salida">("Entrada");

  const openModal = (type: "Entrada" | "Salida") => {
    setModalOpen(type);
    setIsModalOpen(true);
  };

  // Filtrar transacciones reales
  const inflows = transactions.filter(t => t.amount > 0);
  const outflows = transactions.filter(t => t.amount < 0 && t.category !== "Inversión");

  const totalInflows = inflows.reduce((acc, t) => acc + t.amount, 0);
  const totalOutflows = outflows.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // Calcular eficiencia (uso de capital)
  const capitalTotal = capitalInicial + totalInflows;
  const usageRate = capitalTotal > 0 ? ((totalInvertido / capitalTotal) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Modal de Transacción */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalType === "Entrada" ? "Añadir Capital" : "Registrar Salida"}
      >
        <TransactionForm type={modalType} onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Capital</h1>
          <p className="text-slate-500 font-bold">Análisis comparativo de flujos de efectivo y reservas reales.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal("Entrada")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
          >
            <ArrowUpCircle className="w-4 h-4" />
            Nueva Entrada
          </button>
          <button 
            onClick={() => openModal("Salida")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-black text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
          >
            <ArrowDownCircle className="w-4 h-4" />
            Nueva Salida
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Superior */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden border-l-4 border-l-blue-600">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <CircleDollarSign className="w-24 h-24 text-slate-900" />
          </div>
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-2">Capital Total Gestionado</p>
          <h2 className="text-4xl font-black text-slate-900 mb-2">{formatCurrency(capitalTotal)}</h2>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
            Estado del Sistema
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl flex items-center gap-6 border-l-4 border-l-emerald-500">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
              <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-blue-600" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * Number(usageRate)) / 100} />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black text-slate-900">{usageRate}%</span>
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-800 leading-tight">Uso de Capital</h4>
            <p className="text-xs text-slate-500 font-bold mb-3">Eficiencia Operativa</p>
            <button className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Configurar →</button>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl flex items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16" />
          <div className="grid grid-cols-2 gap-8 relative z-10 w-full text-center">
            <div>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">Liquidez</p>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">{formatCurrency(efectivoDisponible)}</span>
                <span className="text-[8px] font-bold text-emerald-400 mt-1 uppercase">Disponible</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-2">ROI Neto</p>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">0.0%</span>
                <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Sin Datos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo Comparativo Reales */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Panel de Entradas */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-600/5 border border-emerald-50">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Entradas de Capital</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Inyecciones Reales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total</p>
              <p className="text-xl font-black text-emerald-600">{formatCurrency(totalInflows)}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[250px]">
            {inflows.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5">Fuente</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {inflows.map((e) => (
                    <tr key={e.id} className="hover:bg-emerald-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-base">{e.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{e.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-600 text-lg text-right whitespace-nowrap">
                        +{formatCurrency(e.amount)}
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-bold text-right text-xs whitespace-nowrap">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full pt-12 space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <ArrowUpCircle className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin entradas registradas</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel de Salidas */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-rose-600/5 border border-rose-50">
          <div className="p-8 border-b border-rose-100/50 flex justify-between items-center bg-rose-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <ArrowDownCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Salidas y Gastos</h3>
                <p className="text-xs text-rose-400 font-bold uppercase tracking-widest">Gastos Reales</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total</p>
              <p className="text-xl font-black text-rose-600">{formatCurrency(totalOutflows)}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[250px]">
            {outflows.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead className="text-[9px] uppercase tracking-[0.2em] text-rose-300 font-black bg-rose-50/50">
                  <tr>
                    <th className="px-8 py-5">Entidad</th>
                    <th className="px-8 py-5 text-right">Monto</th>
                    <th className="px-8 py-5 text-right">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50 text-sm">
                  {outflows.map((e) => (
                    <tr key={e.id} className="hover:bg-rose-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-base">{e.name}</span>
                          <span className="text-[10px] font-bold text-rose-400 uppercase">{e.category}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-rose-600 text-lg text-right whitespace-nowrap">
                        -{formatCurrency(Math.abs(e.amount))}
                      </td>
                      <td className="px-8 py-6 text-slate-400 font-bold text-right text-xs whitespace-nowrap">{e.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full pt-12 space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                  <ArrowDownCircle className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin gastos registrados</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sección de Asignación */}
      <div className="glass-card p-10 rounded-[2.5rem]">
        <h4 className="font-black text-slate-900 mb-10 text-xl tracking-tight">Estrategia de Asignación por Sector</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { name: "Inmobiliaria", value: 0, color: "bg-slate-900", detail: "Activos Inmobiliarios" },
            { name: "Tecnología", value: 0, color: "bg-blue-600", detail: "Software & SaaS" },
            { name: "Venture Equity", value: 0, color: "bg-emerald-500", detail: "Nuevas Empresas" },
            { name: "Otros", value: 0, color: "bg-indigo-500", detail: "Diversos" },
          ].map((item) => (
            <div key={item.name} className="space-y-4 opacity-40 grayscale">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.name}</span>
                  <span className="text-[9px] font-bold text-slate-300">{item.detail}</span>
                </div>
                <span className="text-2xl font-black text-slate-900">{item.value}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} shadow-sm`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
