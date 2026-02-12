import type { Image } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import type { ProductRequest } from "../types/payload/request/product.request.ts";
import { CategoryService } from "./category.service.ts";
import { ImageService } from "./image.service.ts";

export const ProductService = {
  findAllProducts: async () => {
    return prisma.menuItem.findMany({
      include: {
        image: true,
        category: true,
      },
    });
  },

  findProductById: async (id: number) => {
    return prisma.menuItem.findUnique({
      where: { id },
    });
  },

  createProduct: async (payload: ProductRequest) => {
    const image: Image = await ImageService.uploadImage(payload.image);
    const category = await CategoryService.findCategoryById(payload.categoryId);

    if (!category) throw new Error("Category not found");

    const Product = await prisma.menuItem.create({
      data: {
        name: payload.name,
        sku: payload.sku,
        description: payload.description,
        price: payload.price,
        imageId: image.id,
        categoryId: category.id,
      },
    });

    return Product;
  },

  updateProduct: async (
    id: number,
    payload: ProductRequest & { image?: Express.Multer.File },
  ) => {
    const product = await prisma.menuItem.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");

    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined)
      updateData.description = payload.description;

    if (payload.image) {
      const newImage = await ImageService.uploadImage(payload.image);
      updateData.imageId = newImage.id;

      if (product.imageId) {
        try {
          await ImageService.deleteImage(product.imageId);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }
    }

    return prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: { image: true },
    });
  },
  deleteProduct: async (id: number) => {
    return prisma.menuItem.delete({
      where: { id },
    });
  },
};
