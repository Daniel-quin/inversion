/**
 * Utilidades de formateo para el estándar Platinum Plus
 */

/**
 * Formatea un número con puntos para miles y millones (estilo de-DE)
 * Ejemplo: 12450000 -> 12.450.000
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('de-DE').format(value);
};

/**
 * Formatea un valor como moneda con el símbolo pegado y puntos
 * Ejemplo: 42850000 -> $42.850.000
 */
export const formatCurrency = (value: number, includeSign: boolean = false): string => {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  const formatted = formatNumber(absoluteValue);
  
  if (includeSign) {
    return `${isNegative ? '-' : '+'}$${formatted}`;
  }
  return `${isNegative ? '-' : ''}$${formatted}`;
};

/**
 * Formatea porcentajes con el signo correspondiente
 */
export const formatPercent = (value: number): string => {
  const isNegative = value < 0;
  return `${isNegative ? '' : '+'}${value.toFixed(2)}%`;
};
