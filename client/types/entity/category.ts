import { Image } from "./image";

export type Category = {
  id?: number;
  name: string;
  description: string;
  image?: Image;
};
