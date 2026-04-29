"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { InvestmentProvider } from "@/context/InvestmentContext";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`}>
        <AuthProvider>
          <InvestmentProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </InvestmentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <div className="flex h-screen overflow-hidden">
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {!isLoginPage && (
          <>
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />
          </>
        )}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
