export const CHART_COLORS = ['#1565C0', '#29A9E1', '#8BC34A', '#E07B39', '#0B6E99', '#8E5BC2'] as const;

const OTHER_COLOR = '#90A4AE';

/**Para que la categoría siempre tenga un único color característico*/
export const getCategoryColor = (category: string, allCategories: readonly string[]): string => {
  const index = [...allCategories].sort((a, b) => a.localeCompare(b, 'es')).indexOf(category);
  return CHART_COLORS[index] ?? OTHER_COLOR;
};