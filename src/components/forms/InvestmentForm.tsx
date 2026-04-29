"use client";

import { 
  DollarSign, 
  Briefcase, 
  Tag, 
  PieChart, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Info,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { formatNumber } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";

export default function InvestmentForm({ onSuccess }: { onSuccess: () => void }) {
  const { addInvestment } = useInvestments();
  const [riskLevel, setRiskLevel] = useState<"bajo" | "medio" | "alto">("bajo");
  
  // Estados del Formulario
  const [name, setName] = useState("");
  const [sector, setSector] = useState("Tecnología & SaaS");
  const [category, setCategory] = useState("Capital Privado");
  const [amount, setAmount] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue === "") {
      setAmount("");
      return;
    }
    const formattedValue = formatNumber(parseInt(rawValue));
    setAmount(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    addInvestment({
      name,
      sector,
      category,
      amount: parseInt(amount.replace(/\./g, ""))
    });
    
    onSuccess();
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Columna Izquierda: Identidad del Activo */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Identidad del Activo</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Comercial</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Lumina Energy Systems"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Sector de Mercado</label>
              <div className="relative group">
                <PieChart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <select 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                >
                  <option>Tecnología & SaaS</option>
                  <option>Bienes Raíces de Lujo</option>
                  <option>Infraestructura Renovable</option>
                  <option>Biotecnología</option>
                  <option>Venture Capital</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Perfil de Riesgo</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'bajo', label: 'Bajo', color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                  { id: 'medio', label: 'Medio', color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
                  { id: 'alto', label: 'Alto', color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRiskLevel(r.id as any)}
                    className={clsx(
                      "flex flex-col items-center p-3 rounded-2xl border-2 transition-all gap-1",
                      riskLevel === r.id 
                        ? `border-${r.color.split('-')[1]}-500 ${r.bg} ${r.text}` 
                        : "border-slate-50 bg-white text-slate-400 grayscale opacity-60"
                    )}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Proyección Financiera */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Métricas Financieras</h4>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Inyección Inicial</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-black text-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-xs focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
                  >
                    <option>Capital Privado</option>
                    <option>Venture Capital</option>
                    <option>Bienes Raíces</option>
                    <option>Acciones</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ROI Mensual Esperado</label>
                <div className="relative">
                  <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <input 
                    type="text" 
                    placeholder="2.5%"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-[1.5rem] bg-slate-900 text-white relative overflow-hidden shadow-xl mt-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-2xl -mr-12 -mt-12" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-2 rounded-xl bg-white/10 text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nota del Sistema</h5>
                  <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                    Este activo se clasificará como <span className="text-white font-bold">Inversión Directa</span> reduciendo el saldo de caja disponible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <button 
          type="submit"
          className="w-full group relative flex items-center justify-center gap-3 py-5 rounded-3xl bg-slate-900 text-white font-black text-base hover:bg-black transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          <span>Confirmar y Desplegar Capital</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </form>
  );
}
