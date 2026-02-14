import { Category } from "./category";
import { Image } from "./image";

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  price: number;
  category: Category;
  image: Image;
};
