import type { Express } from "express";

import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import CategoryRouter from "./routes/category.route.ts";
import EmployeeRouter from "./routes/employee.route.ts";
import ProductRouter from "./routes/product.route.ts";

const app: Express = express();
const PORT: number = 4000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/category", CategoryRouter);
app.use("/product", ProductRouter);
app.use("/employee", EmployeeRouter);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
