"use client";

import { 
  DollarSign, 
  User, 
  Tag, 
  ChevronRight,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { useState } from "react";
import { formatNumber } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";
import { clsx } from "clsx";

interface TransactionFormProps {
  type: "Entrada" | "Salida";
  onSuccess: () => void;
}

export default function TransactionForm({ type, onSuccess }: TransactionFormProps) {
  const { addTransaction } = useInvestments();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const isInflow = type === "Entrada";

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

    addTransaction({
      name,
      category: category || (isInflow ? "Inyección de Capital" : "Gasto Operativo"),
      type,
      amount: parseInt(amount.replace(/\./g, ""))
    });
    
    onSuccess();
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 p-6 rounded-3xl bg-slate-50 border border-slate-100">
        <div className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
          isInflow ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
        )}>
          {isInflow ? <ArrowUpCircle className="w-6 h-6" /> : <ArrowDownCircle className="w-6 h-6" />}
        </div>
        <div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {isInflow ? "Registrar Ingreso" : "Registrar Egreso"}
          </h4>
          <p className="text-xs text-slate-400 font-bold">
            {isInflow ? "Añadir fondos al capital disponible" : "Registrar un gasto o salida de caja"}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            {isInflow ? "Fuente / Inversionista" : "Entidad / Concepto"}
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1-2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isInflow ? "Ej. Retorno de Inversión" : "Ej. Pago de Servicios"}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoría</label>
          <div className="relative group">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej. Operaciones"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Monto del Movimiento</label>
          <div className="relative group">
            <DollarSign className={clsx(
              "absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors",
              isInflow ? "text-emerald-500" : "text-rose-500"
            )} />
            <input 
              type="text" 
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className={clsx(
                "w-full pl-12 pr-4 py-6 rounded-[2rem] border-2 border-slate-50 bg-white text-slate-900 font-black text-3xl focus:ring-8 outline-none transition-all placeholder:text-slate-100",
                isInflow ? "focus:ring-emerald-500/5 focus:border-emerald-500" : "focus:ring-rose-500/5 focus:border-rose-500"
              )}
              required
            />
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className={clsx(
          "w-full group relative flex items-center justify-center gap-3 py-5 rounded-[2rem] text-white font-black text-base transition-all shadow-2xl overflow-hidden",
          isInflow ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20" : "bg-slate-900 hover:bg-black shadow-slate-900/20"
        )}
      >
        <span>{isInflow ? "Confirmar Ingreso" : "Confirmar Egreso"}</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  );
}
