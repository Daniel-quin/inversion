"use client";

import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from "recharts";
import { formatNumber } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";

export default function GrowthChart() {
  const { capitalInicial, totalInvertido } = useInvestments();

  // Generar datos dinámicos basados en la realidad actual
  // Al empezar de cero, mostramos el punto inicial (Capital) y el actual (Capital + Inversiones)
  const data = [
    { name: "Punto Inicial", value: capitalInicial },
    { name: "Situación Actual", value: capitalInicial + totalInvertido },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col shadow-2xl shadow-slate-200/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900">Dinámica del Patrimonio</h3>
          <p className="text-sm text-slate-500 font-medium">Evolución basada en capital e inversiones reales</p>
        </div>
        <div className="bg-slate-100 text-[10px] font-black px-3 py-2 rounded-xl text-slate-500 uppercase tracking-widest">
          Tiempo Real
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              hide 
              domain={['dataMin * 0.8', 'dataMax * 1.2']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                padding: '12px'
              }}
              itemStyle={{ fontWeight: 800, color: '#0f172a' }}
              labelStyle={{ fontWeight: 700, color: '#64748b', marginBottom: '4px' }}
              formatter={(value: number) => [`$${formatNumber(value)}`, 'Patrimonio Total']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              dot={{ r: 6, fill: '#3B82F6', strokeWidth: 3, stroke: '#fff' }}
              activeDot={{ r: 8, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
