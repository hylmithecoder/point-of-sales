import type { Request, Response } from "express";
import { EmployeeService } from "../services/employee.service.ts";

export const EmployeeController = {
  findAllEmployees: async (req: Request, res: Response) => {
    res.json(await EmployeeService.findAllEmployees());
  },

  findEmployeeById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const Employee = await EmployeeService.findEmployeeById(id);
    res.json(Employee);
  },

  createEmployee: async (req: Request, res: Response) => {
    const Employee = await EmployeeService.createEmployee(req.body);
    res.status(201).json(Employee);
  },

  updateEmployee: async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const Employee = await EmployeeService.updateEmployee(id, req.body);
    res.status(201).json(Employee);
  },

  deleteEmployee: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await EmployeeService.deleteEmployee(id);
    res.status(204).send();
  },
};
