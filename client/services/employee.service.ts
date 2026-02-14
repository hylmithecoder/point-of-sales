import { Employee } from "@/types/entity/employee";
import { ApiClient } from "./config/api.client";

export class EmployeeService {
  static async findAllEmployees() {
    return ApiClient.get("employee").json<Employee[]>();
  }

  static async findEmployeeById(id: number) {
    return ApiClient.get(`employee/${id}`).json<Employee>();
  }

  static async createEmployee(data: FormData) {
    return ApiClient.post("employee", {
      body: data,
    }).json<Employee>();
  }

  static async updateEmployee(id: number, data: FormData) {
    return ApiClient.put(`employee/${id}`, {
      body: data,
    }).json<Employee>();
  }

  static async deleteEmployee(id: number) {
    return ApiClient.delete(`employee/${id}`).json<Employee>();
  }
}
