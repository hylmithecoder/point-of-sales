import { Router } from "express";
import multer from "multer";
import { storage } from "../config/file.upload.ts";
import { ProductController } from "../controllers/product.controller.ts";

const ProductRouter: Router = Router();
const upload = multer({ storage });

ProductRouter.get("/", ProductController.findAllProducts);
ProductRouter.get("/:id", ProductController.findProductById);
ProductRouter.post(
  "/",
  upload.single("image"),
  ProductController.createProduct,
);
ProductRouter.put(
  "/:id",
  upload.single("image"),
  ProductController.updateProduct,
);
ProductRouter.delete("/:id", ProductController.deleteProduct);

export default ProductRouter;
