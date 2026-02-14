import { Category } from "@/types/entity/category";
import { BaseResponse } from "@/types/payload/response/base.response";
import { ApiClient } from "./config/api.client";

export class CategoryService {
  static async findAllCategories() {
    return ApiClient.get("?resource=category").json<BaseResponse<Category[]>>();
  }

  static async findCategoryById(id: number) {
    return ApiClient.get(`?resource=category&id=${id}`).json<
      BaseResponse<Category>
    >();
  }

  static async createCategory(data: FormData) {
    return ApiClient.post("?resource=category", {
      body: data,
    }).json<BaseResponse<Category>>();
  }

  static async updateCategory(id: number, data: FormData) {
    return ApiClient.post(`?resource=category&id=${id}`, {
      body: data,
    }).json<Category>();
  }

  static async deleteCategory(id: number) {
    return ApiClient.delete(`?resource=category&id=${id}`, {
      json: {
        token: sessionStorage.getItem("session_token"),
      },
    }).json<Category>();
  }
}
