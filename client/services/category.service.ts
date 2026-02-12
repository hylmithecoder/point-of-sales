import { Category } from "@/types/entity/category";
import { ApiClient } from "./config/api.client";

export class CategoryService {
  static async findAllCategories() {
    return ApiClient.get("category").json<Category[]>();
  }

  static async findCategoryById(id: number) {
    return ApiClient.get(`category/${id}`).json<Category>();
  }

  static async createCategory(data: FormData) {
    return ApiClient.post("category", {
      body: data,
    }).json<Category>();
  }

  static async updateCategory(id: number, data: FormData) {
    return ApiClient.put(`category/${id}`, {
      body: data,
    }).json<Category>();
  }

  static async deleteCategory(id: number) {
    return ApiClient.delete(`category/${id}`).json<Category>();
  }
}
