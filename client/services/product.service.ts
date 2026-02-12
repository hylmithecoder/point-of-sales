import { Product } from "@/types/entity/product";
import { ApiClient } from "./config/api.client";

export class ProductService {
  static async findAllProducts() {
    return ApiClient.get("product").json<Product[]>();
  }

  static async findProductById(id: number) {
    return ApiClient.get(`product/${id}`).json<Product>();
  }

  static async createProduct(data: FormData) {
    return ApiClient.post("product", {
      body: data,
    }).json<Product>();
  }

  static async updateProduct(id: number, data: FormData) {
    return ApiClient.put(`product/${id}`, {
      body: data,
    }).json<Product>();
  }

  static async deleteProduct(id: number) {
    return ApiClient.delete(`product/${id}`).json<Product>();
  }
}
