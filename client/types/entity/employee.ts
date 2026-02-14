export type Employee = {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "ADMIN" | "SERVER" | "CASHIER" | "KITCHEN";
  isActive: boolean;
};
