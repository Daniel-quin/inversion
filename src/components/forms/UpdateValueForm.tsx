"use client";

import { DollarSign, ChevronRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useInvestments, Investment } from "@/context/InvestmentContext";

interface UpdateValueFormProps {
  investment: Investment;
  onSuccess: () => void;
}

export default function UpdateValueForm({ investment, onSuccess }: UpdateValueFormProps) {
  const { updateInvestmentValue } = useInvestments();
  const [amount, setAmount] = useState(investment.valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

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
    if (!amount) return;
    const finalAmount = parseInt(amount.replace(/\./g, ""));
    updateInvestmentValue(investment.id, finalAmount);
    onSuccess();
  };

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-black text-slate-900">{investment.name}</h4>
        <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
          Actualice la valuación actual de este activo para recalcular el ROI.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nuevo Valor de Mercado</label>
          <div className="relative group">
            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full pl-14 pr-6 py-6 rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 text-slate-900 font-black text-3xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
              autoFocus
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full group relative flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg hover:bg-black transition-all shadow-2xl shadow-slate-900/20"
        >
          <span>Actualizar Valuación</span>
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>
    </div>
  );
}
