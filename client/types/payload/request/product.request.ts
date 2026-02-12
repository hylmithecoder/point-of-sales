import { z } from "zod";

export const productRequest = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  categoryId: z.number().int("Category ID must be an integer"),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Image is required")
    .refine(
      (files) =>
        files &&
        ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type),
      "Only JPEG, PNG, GIF are allowed",
    ),
});

export type ProductRequest = z.infer<typeof productRequest>;
