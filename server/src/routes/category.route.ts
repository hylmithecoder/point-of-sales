import { Router } from "express";
import multer from "multer";
import { storage } from "../config/file.upload.ts";
import { CategoryController } from "../controllers/category.controller.ts";

const categoryRouter: Router = Router();
const upload = multer({ storage });

categoryRouter.get("/", CategoryController.findAllCategories);
categoryRouter.get("/:id", CategoryController.findCategoryById);
categoryRouter.post(
  "/",
  upload.single("image"),
  CategoryController.createCategory,
);
categoryRouter.put(
  "/:id",
  upload.single("image"),
  CategoryController.updateCategory,
);
categoryRouter.delete("/:id", CategoryController.deleteCategory);

export default categoryRouter;
