export const CHART_COLORS = ['#1565C0', '#29A9E1', '#8BC34A', '#E07B39', '#0B6E99', '#8E5BC2'] as const;

/** Gris neutro para agrupar las categorías que no caben en la paleta ("Otras") */
export const OTHER_COLOR = '#90A4AE';

/** Tonos de gris que se alternan en la dona para las categorías agrupadas en "Otras" */
export const OTHER_SHADES = ['#90A4AE', '#B0BEC5', '#78909C'] as const;

/**Para que la categoría siempre tenga un único color característico*/
export const getCategoryColor = (category: string, allCategories: readonly string[]): string => {
  const index = [...allCategories].sort((a, b) => a.localeCompare(b, 'es')).indexOf(category);
  return CHART_COLORS[index] ?? OTHER_COLOR;
};