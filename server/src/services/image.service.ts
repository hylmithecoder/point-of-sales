import { prisma } from "../../lib/prisma.ts";

export const ImageService = {
  uploadImage: async (image: Express.Multer.File) => {
    const filePath = `/uploads/${image.filename}`;
    return prisma.image.create({
      data: {
        url: filePath,
        altText: image.originalname,
      },
    });
  },
  deleteImage: async (id: number) => {
    return prisma.image.delete({
      where: { id },
    });
  },
};
