export type ProductRequest = {
  name: string;
  sku: string;
  description: string;
  price: number;
  categoryId: number;
  image: Express.Multer.File;
};
