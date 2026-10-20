import { z } from 'zod';
import { CATEGORY_REGEX, IMAGE_URL_REGEX, TITLE_REGEX } from './patterns';

export const PRODUCT_LIMITS = {
  titleMin: 3,
  titleMax: 150,
  descriptionMax: 1000,
  categoryMax: 50,
  priceMin: 0.01,
  priceMax: 1_000_000,
  stockMax: 1_000_000,
  imagesMax: 4,
} as const;

const PRICE_REGEX = /^\d+([.,]\d{1,2})?$/;
const INTEGER_REGEX = /^\d+$/;

export const parsePrice = (value: string): number => Number(value.replace(',', '.'));

/**Validaciones del formulario de producto*/
export const productFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(PRODUCT_LIMITS.titleMin, `El título debe tener mínimo ${PRODUCT_LIMITS.titleMin} caracteres`)
    .max(PRODUCT_LIMITS.titleMax, `El título puede tener máximo ${PRODUCT_LIMITS.titleMax} caracteres`)
    .regex(TITLE_REGEX, "El título solo admite letras, números, espacios y los signos . , ( ) / & % ' + -"),
  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(PRODUCT_LIMITS.descriptionMax, `La descripción puede tener máximo ${PRODUCT_LIMITS.descriptionMax} caracteres`),
  category: z
    .string()
    .trim()
    .min(1, 'La categoría es obligatoria')
    .max(PRODUCT_LIMITS.categoryMax, `La categoría puede tener máximo ${PRODUCT_LIMITS.categoryMax} caracteres`)
    .regex(CATEGORY_REGEX, 'La categoría solo admite letras y espacios'),
  price: z
    .string()
    .trim()
    .min(1, 'El precio es obligatorio')
    .regex(PRICE_REGEX, 'Ingresa un número con máximo 2 decimales, por ejemplo 15000 o 15000,50')
    .refine((value) => parsePrice(value) >= PRODUCT_LIMITS.priceMin, 'El precio debe ser mayor a 0')
    .refine((value) => parsePrice(value) <= PRODUCT_LIMITS.priceMax, 'El precio es demasiado alto'),
  stock: z
    .string()
    .trim()
    .min(1, 'El stock es obligatorio')
    .regex(INTEGER_REGEX, 'El stock debe ser un número entero, sin decimales ni signos')
    .refine((value) => Number(value) <= PRODUCT_LIMITS.stockMax, 'El stock es demasiado alto'),
  images: z
    .array(
      z.object({
        url: z
          .string()
          .trim()
          .refine((value) => value === '' || IMAGE_URL_REGEX.test(value), 'Ingresa una URL válida que empiece por http:// o https://'),
      }),
    )
    .max(PRODUCT_LIMITS.imagesMax, `Se permiten máximo ${PRODUCT_LIMITS.imagesMax} imágenes`),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;