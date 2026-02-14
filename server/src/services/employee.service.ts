import type { Employee } from "../../generated/prisma/client.ts";
import { prisma } from "../../lib/prisma.ts";

export const EmployeeService = {
  findAllEmployees: async () => {
    return prisma.employee.findMany({});
  },

  findEmployeeById: async (id: number) => {
    return prisma.employee.findUnique({
      where: { id },
    });
  },

  createEmployee: async (payload: Employee) => {
    const Employee = await prisma.employee.create({
      data: payload,
    });

    return Employee;
  },

  updateEmployee: async (id: number, payload: Employee) => {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new Error("Employee not found");

    return prisma.employee.update({
      where: { id },
      data: payload,
    });
  },
  deleteEmployee: async (id: number) => {
    return prisma.employee.delete({
      where: { id },
    });
  },
};
