import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InvestmentProvider } from "@/context/InvestmentContext";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WealthPort - Tablero de Inversiones Elite",
  description: "Gestión institucional de portafolio y capital.",
};

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
