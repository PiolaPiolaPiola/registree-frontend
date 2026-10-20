import dayjs from 'dayjs';
import 'dayjs/locale/es';

const currencyWithDecimals = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyWithoutDecimals = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-CO');

export const formatCurrency = (value: number): string =>
  Number.isInteger(value) ? currencyWithoutDecimals.format(value) : currencyWithDecimals.format(value);

/** Separador de miles */
export const formatNumber = (value: number): string => numberFormatter.format(value);

export const formatDate = (isoDate: string): string => dayjs(isoDate).locale('es').format('DD MMM YYYY');