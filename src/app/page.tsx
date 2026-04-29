"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Download, 
  Wallet, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  DollarSign,
  AlertCircle
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import GrowthChart from "@/components/dashboard/GrowthChart";
import AllocationChart from "@/components/dashboard/AllocationChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { exportToExcel } from "@/lib/export";
import Modal from "@/components/Modal";
import InvestmentForm from "@/components/forms/InvestmentForm";
import InitialCapitalForm from "@/components/forms/InitialCapitalForm";
import { formatCurrency } from "@/lib/utils";
import { useInvestments } from "@/context/InvestmentContext";

export default function Dashboard() {
  const { 
    capitalInicial, 
    efectivoDisponible, 
    totalInvertido, 
    transactions, 
    isLoaded,
    gananciaTotal,
    roiGlobal
  } = useInvestments();
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isInitialModalOpen, setIsInitialModalOpen] = useState(false);

  // Abrir modal inicial solo si los datos ya cargaron y el capital sigue siendo 0
  useEffect(() => {
    if (isLoaded && capitalInicial === 0) {
      setIsInitialModalOpen(true);
    } else if (isLoaded && capitalInicial > 0) {
      setIsInitialModalOpen(false);
    }
  }, [capitalInicial, isLoaded]);

  const handleExport = () => {
    exportToExcel(transactions, "WealthPort_Resumen_Inversiones");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Modal Inicial: Configuración de Capital */}
      <Modal 
        isOpen={isInitialModalOpen} 
        onClose={() => setIsInitialModalOpen(false)} 
        title="Bienvenido a WealthPort"
      >
        <InitialCapitalForm onSuccess={() => setIsInitialModalOpen(false)} />
      </Modal>

      {/* Modal: Nueva Inversión */}
      <Modal 
        isOpen={isInvestmentModalOpen} 
        onClose={() => setIsInvestmentModalOpen(false)} 
        title="Registrar Nueva Inversión"
      >
        <InvestmentForm onSuccess={() => setIsInvestmentModalOpen(false)} />
      </Modal>

      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Resumen de Inversiones
          </h1>
          <p className="text-slate-500 font-bold">
            Instantánea del rendimiento de su portafolio institucional.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Exportar Informe
          </button>
          <button 
            onClick={() => setIsInvestmentModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-slate-900/10"
          >
            <Plus className="w-4 h-4" />
            Nueva Inversión
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Capital Inicial" 
          value={formatCurrency(capitalInicial)} 
          icon={Wallet}
          subtitle="Saldo Base"
        />
        <StatCard 
          title="Efectivo Disponible" 
          value={formatCurrency(efectivoDisponible)} 
          icon={DollarSign}
          subtitle="Listo para inversión"
          trend={efectivoDisponible > 0 ? "up" : "neutral"}
        />
        <StatCard 
          title="Total Invertido" 
          value={formatCurrency(totalInvertido)} 
          icon={PieChartIcon}
          subtitle={`${capitalInicial > 0 ? ((totalInvertido / capitalInicial) * 100).toFixed(0) : 0}% del Capital Total`}
          trend="neutral"
        />
        <StatCard 
          title="Ganancia/Pérdida Total" 
          value={formatCurrency(gananciaTotal, true)} 
          change={`${roiGlobal >= 0 ? '+' : ''}${roiGlobal.toFixed(2)}%`}
          isPositive={gananciaTotal >= 0}
          icon={TrendingUp}
          subtitle="Basado en ROI actual"
          trend={gananciaTotal > 0 ? "up" : gananciaTotal < 0 ? "down" : "neutral"}
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart />
        </div>
        <div>
          <AllocationChart />
        </div>
      </div>

      {/* Transacciones y Táctica */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <RecentTransactions />
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16" />
            <TrendingUp className="w-8 h-8 text-blue-400 mb-6" />
            <h4 className="text-xl font-black mb-2">Análisis de Eficiencia</h4>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
              Añada su capital y comience a registrar inversiones para ver su índice de eficiencia.
            </p>
            
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10 mb-8">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-1">Estatus del Sistema</p>
              <p className="text-blue-400 font-black text-lg">Listo para Iniciar</p>
            </div>
            
            <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-sm hover:bg-slate-50 transition-colors shadow-xl">
              Configurar Alertas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
