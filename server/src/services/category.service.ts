import type { Image } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";
import type { CategoryRequest } from "../types/payload/request/category.request.ts";
import { ImageService } from "./image.service.ts";

export const CategoryService = {
  findAllCategories: async () => {
    return prisma.category.findMany({
      include: {
        image: true,
      },
    });
  },

  findCategoryById: async (id: number) => {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  createCategory: async (payload: CategoryRequest) => {
    const image: Image = await ImageService.uploadImage(payload.image);
    const category = await prisma.category.create({
      data: {
        name: payload.name,
        description: payload.description,
        imageId: image.id,
      },
    });

    return category;
  },

  updateCategory: async (
    id: number,
    payload: CategoryRequest & { image?: Express.Multer.File },
  ) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new Error("Category not found");

    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined)
      updateData.description = payload.description;

    if (payload.image) {
      const newImage = await ImageService.uploadImage(payload.image);
      updateData.imageId = newImage.id;

      if (category.imageId) {
        try {
          await ImageService.deleteImage(category.imageId);
        } catch (err) {
          console.warn("Failed to delete old image:", err);
        }
      }
    }

    return prisma.category.update({
      where: { id },
      data: updateData,
      include: { image: true },
    });
  },
  deleteCategory: async (id: number) => {
    return prisma.category.delete({
      where: { id },
    });
  },
};
