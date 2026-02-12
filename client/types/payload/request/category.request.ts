import { z } from "zod";

export const CategoryRequest = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name cannot exceed 100 characters"),
  description: z.string().min(1, "Category description is required"),
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

export type CategoryRequest = z.infer<typeof CategoryRequest>;
