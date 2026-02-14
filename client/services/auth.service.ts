import { LoginRequest } from "@/types/payload/request/login.request";
import { RegisterRequest } from "@/types/payload/request/register.request";
import { BaseResponse } from "@/types/payload/response/base.response";
import { LoginResponse } from "@/types/payload/response/login.response";
import { ApiClient } from "./config/api.client";

export class AuthService {
  static async login(data: LoginRequest) {
    return ApiClient.post("?resource=auth&action=login", {
      json: data,
    }).json<BaseResponse<LoginResponse>>();
  }
  static async register(data: RegisterRequest) {
    return ApiClient.post("?resource=auth&action=register", {
      json: data,
    }).json();
  }
}
