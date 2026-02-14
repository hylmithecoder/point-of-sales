import { Router } from "express";
import multer from "multer";
import { storage } from "../config/file.upload.ts";
import { CategoryController } from "../controllers/category.controller.ts";

const CategoryRouter: Router = Router();
const upload = multer({ storage });

CategoryRouter.get("/", CategoryController.findAllCategories);
CategoryRouter.get("/:id", CategoryController.findCategoryById);
CategoryRouter.post(
  "/",
  upload.single("image"),
  CategoryController.createCategory,
);
CategoryRouter.put(
  "/:id",
  upload.single("image"),
  CategoryController.updateCategory,
);
CategoryRouter.delete("/:id", CategoryController.deleteCategory);

export default CategoryRouter;
