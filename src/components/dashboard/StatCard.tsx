import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon,
  subtitle,
  trend
}: StatCardProps) {
  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={clsx(
            "text-xs font-bold px-2 py-1 rounded-full",
            isPositive 
              ? "bg-emerald-100 text-emerald-600" 
              : "bg-rose-100 text-rose-600"
          )}>
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mb-2">{value}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              trend === "up" ? "bg-emerald-500" : trend === "down" ? "bg-rose-500" : "bg-slate-300"
            )} />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
