import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.ts";

const EmployeeRouter: Router = Router();

EmployeeRouter.get("/", EmployeeController.findAllEmployees);
EmployeeRouter.get("/:id", EmployeeController.findEmployeeById);
EmployeeRouter.post("/", EmployeeController.createEmployee);
EmployeeRouter.put("/:id", EmployeeController.updateEmployee);
EmployeeRouter.delete("/:id", EmployeeController.deleteEmployee);

export default EmployeeRouter;
