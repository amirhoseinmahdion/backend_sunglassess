import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must contain at least 2 characters")
    .max(150, "Product name is too long"),

  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(160, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can contain lowercase letters, numbers and hyphens only",
    ),

  description: z
    .string()
    .trim()
    .max(3000, "Description is too long")
    .optional()
    .nullable(),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(100, "Category is too long"),

  price: z.coerce
    .number()
    .positive("Price must be greater than zero"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  image: z
    .string()
    .trim()
    .min(1, "Product image is required"),

  featured: z.boolean().optional().default(false),

  active: z.boolean().optional().default(true),
});

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;