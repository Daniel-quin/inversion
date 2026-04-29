"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: number;
  name: string;
  category: string;
  type: string; // "Entrada" | "Salida" | "Inversión"
  date: string;
  amount: number;
  status: string;
}

export interface Investment {
  id: number;
  name: string;
  sub: string;
  category: string;
  monto: number;
  valor: number;
  roi: number;
  status: string;
  icon: string;
}

interface InvestmentContextType {
  capitalInicial: number;
  setCapitalInicial: (value: number) => void;
  investments: Investment[];
  transactions: Transaction[];
  addInvestment: (investment: any) => void;
  addTransaction: (transaction: any) => void;
  updateInvestmentValue: (id: number, newValue: number) => void;
  deleteInvestment: (id: number) => void;
  deleteTransaction: (id: number) => void;
  efectivoDisponible: number;
  totalInvertido: number;
  gananciaTotal: number;
  roiGlobal: number;
  isLoaded: boolean;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function InvestmentProvider({ children }: { children: React.ReactNode }) {
  // Inicialización segura desde localStorage
  const [capitalInicial, setCapitalInicial] = useState<number>(0);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos una sola vez al montar
  useEffect(() => {
    try {
      const savedCapital = localStorage.getItem('wealthport_capital');
      const savedInvestments = localStorage.getItem('wealthport_investments');
      const savedTransactions = localStorage.getItem('wealthport_transactions');

      if (savedCapital) setCapitalInicial(Number(savedCapital));
      if (savedInvestments) setInvestments(JSON.parse(savedInvestments));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    } catch (error) {
      console.error("Error cargando datos de localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar datos solo después de que la carga inicial se complete
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('wealthport_capital', capitalInicial.toString());
      localStorage.setItem('wealthport_investments', JSON.stringify(investments));
      localStorage.setItem('wealthport_transactions', JSON.stringify(transactions));
    }
  }, [capitalInicial, investments, transactions, isLoaded]);

  // Cálculos dinámicos con seguridad contra nulos
  const totalInvertido = (investments || []).reduce((acc, inv) => acc + (inv.monto || 0), 0);
  const valorActualTotal = (investments || []).reduce((acc, inv) => acc + (inv.valor || 0), 0);
  
  const gananciaTotal = valorActualTotal - totalInvertido;
  const roiGlobal = totalInvertido > 0 ? (gananciaTotal / totalInvertido) * 100 : 0;
  
  const totalEntradas = (transactions || []).filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalSalidas = (transactions || []).filter(t => t.amount < 0 && t.category !== "Inversión").reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const efectivoDisponible = capitalInicial + totalEntradas - totalInvertido - totalSalidas;

  const updateInvestmentValue = (id: number, newValue: number) => {
    setInvestments(prev => prev.map(inv => {
      if (inv.id === id) {
        const roi = ((newValue - inv.monto) / inv.monto) * 100;
        return { ...inv, valor: newValue, roi };
      }
      return inv;
    }));
  };

  const deleteInvestment = (id: number) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const deleteTransaction = (id: number) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addInvestment = (newInv: any) => {
    const id = Date.now();
    const investment: Investment = {
      id,
      name: newInv.name,
      sub: newInv.sector,
      category: newInv.category,
      monto: newInv.amount,
      valor: newInv.amount,
      roi: 0,
      status: "Activo",
      icon: "Briefcase"
    };
    
    // USAR ACTUALIZACIÓN FUNCIONAL PARA EVITAR PERDIDA DE DATOS
    setInvestments(prev => [investment, ...prev]);

    const transaction: Transaction = {
      id,
      name: newInv.name,
      category: "Inversión",
      type: newInv.category,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      amount: -newInv.amount,
      status: "Completado"
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const addTransaction = (newTrans: any) => {
    const transaction: Transaction = {
      id: Date.now(),
      name: newTrans.name,
      category: newTrans.category,
      type: newTrans.type,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      amount: newTrans.type === "Entrada" ? newTrans.amount : -newTrans.amount,
      status: "Completado"
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <InvestmentContext.Provider value={{ 
      capitalInicial, 
      setCapitalInicial,
      investments, 
      transactions, 
      addInvestment,
      addTransaction,
      updateInvestmentValue,
      deleteInvestment,
      deleteTransaction,
      efectivoDisponible,
      totalInvertido,
      gananciaTotal,
      roiGlobal,
      isLoaded
    }}>
      {children}
    </InvestmentContext.Provider>
  );
}

export function useInvestments() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestments must be used within an InvestmentProvider');
  }
  return context;
}
