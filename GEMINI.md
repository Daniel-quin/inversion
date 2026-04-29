# Estándares de Diseño: WealthPort (Tablero de Inversiones)

Este documento define las directrices estéticas y técnicas para el proyecto de Inversión.

## 1. Identidad Visual
- **Estilo:** Platinum Plus / Glassmorphism.
- **Colores:** 
  - Primario: `#3B82F6` (Blue 600)
  - Fondo: `#020617` (Slate 950 en Dark) / `#F8FAFC` (Slate 50 en Light).
  - Acentos: Emerald 500 para ganancias, Rose 500 para pérdidas.
- **Tipografía:** Inter (fuente de sistema limpia y profesional).

## 2. Componentes UI
- **Tarjetas (Glass-Card):** Fondo translúcido con `backdrop-blur-md`, bordes sutiles con opacidad y sombras suaves.
- **Botones:** Bordes redondeados `rounded-xl`, fuentes en negrita y transiciones fluidas.
- **Tablas:** Cabeceras en mayúsculas con espaciado entre letras (`tracking-widest`), filas con efecto hover.

## 3. Lógica Financiera
- **ROI Mensual:** Calculado como `((Valor Actual - Monto Inicial) / Monto Inicial) * 100`.
- **Efectivo Disponible:** Capital Inicial - Suma de Inversiones - Suma de Gastos.

## 4. Tecnologías Core
- **Next.js 14+** (App Router).
- **TypeScript** (Tipado estricto para datos financieros).
- **Recharts** (Gráficas interactivas).
- **Lucide React** (Iconografía minimalista).
