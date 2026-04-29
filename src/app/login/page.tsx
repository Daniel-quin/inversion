"use client";

import { useState } from "react";
import { TrendingUp, User, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clsx } from "clsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto mb-6">
            <TrendingUp className="text-white w-9 h-9" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">WealthPort</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Portal de Inversiones Privado</p>
        </div>

        <div className={clsx(
          "glass-card p-10 rounded-[3rem] shadow-2xl transition-all duration-500 border-2",
          error ? "border-rose-200 shake-animation" : "border-white/40"
        )}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Usuario</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu identificador"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-200"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase">Credenciales Inválidas</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full group relative flex items-center justify-center gap-3 py-5 rounded-[2rem] bg-slate-900 text-white font-black text-sm hover:bg-black transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span>Acceder al Tablero</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
          Acceso exclusivo para miembros autorizados<br/>WealthPort Institutional Assets
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake-animation {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}
