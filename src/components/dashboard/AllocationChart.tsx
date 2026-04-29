"use client";

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from "recharts";
import { useInvestments } from "@/context/InvestmentContext";

const COLORS = ["#0F172A", "#10B981", "#3B82F6", "#6366F1", "#F43F5E"];

export default function AllocationChart() {
  const { investments, totalInvertido } = useInvestments();

  // Calcular distribución real
  const data = investments.reduce((acc: any[], inv) => {
    const existing = acc.find(item => item.name === inv.sub);
    if (existing) {
      existing.value += inv.monto;
    } else {
      acc.push({ name: inv.sub, value: inv.monto });
    }
    return acc;
  }, []);

  // Si no hay datos, mostrar estado vacío
  const chartData = data.length > 0 ? data : [{ name: "Sin Inversiones", value: 1 }];
  const chartColors = data.length > 0 ? COLORS : ["#F1F5F9"];

  return (
    <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col shadow-2xl shadow-slate-200/50">
      <h3 className="text-lg font-black text-slate-900 mb-1">Asignación de Activos</h3>
      <p className="text-sm text-slate-500 font-medium mb-6">Estrategia de diversificación real</p>

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Invertido</span>
          <span className="text-2xl font-black text-slate-900">
            {totalInvertido > 0 ? `${((totalInvertido / totalInvertido) * 100).toFixed(0)}%` : "0%"}
          </span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ fontWeight: 800, color: '#0f172a' }}
              formatter={(value: number) => totalInvertido > 0 ? `$${value.toLocaleString('de-DE')}` : "$0"}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mt-4 overflow-y-auto max-h-[100px] pr-2">
        {data.length > 0 ? data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-slate-500 font-bold">{item.name}</span>
            </div>
            <span className="font-black text-slate-900">{((item.value / totalInvertido) * 100).toFixed(1)}%</span>
          </div>
        )) : (
          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest py-4">No hay activos registrados</p>
        )}
      </div>
    </div>
  );
}
