import { Product } from "@/types/entity/product";
import { BaseResponse } from "@/types/payload/response/base.response";
import { ApiClient } from "./config/api.client";

export class ProductService {
  static async findAllProducts() {
    return ApiClient.get("?resource=product").json<BaseResponse<Product[]>>();
  }

  static async findProductById(id: number) {
    return ApiClient.get(`?resource=product&id=${id}`).json<
      BaseResponse<Product>
    >();
  }

  static async createProduct(data: FormData) {
    return ApiClient.post("?resource=product", {
      body: data,
    }).json<BaseResponse<Product>>();
  }

  static async updateProduct(id: number, data: FormData) {
    return ApiClient.put(`?resource=product&id=${id}`, {
      body: data,
    }).json<BaseResponse<Product>>();
  }

  static async deleteProduct(id: number) {
    return ApiClient.delete(`?resource=product&id=${id}`, {
      json: {
        token: sessionStorage.getItem("session_token"),
      },
    }).json<BaseResponse<Product>>();
  }
}
