import type { Request, Response } from "express";
import { ProductService } from "../services/product.service.ts";

export const ProductController = {
  findAllProducts: async (req: Request, res: Response) => {
    res.json(await ProductService.findAllProducts());
  },

  findProductById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = await ProductService.findProductById(id);
    res.json(product);
  },

  createProduct: async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const payload = {
      name: req.body.name,
      sku: req.body.sku,
      price: Number(req.body.price),
      description: req.body.description,
      image: req.file,
      categoryId: Number(req.body.categoryId),
    };

    const product = await ProductService.createProduct(payload);
    res.status(201).json(product);
  },

  updateProduct: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const payload = {
      name: req.body.name,
      sku: req.body.sku,
      price: req.body.price,
      description: req.body.description,
      image: req.file,
      categoryId: req.body.categoryId,
    };

    const Product = await ProductService.updateProduct(id, payload);
    res.status(201).json(Product);
  },

  deleteProduct: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await ProductService.deleteProduct(id);
    res.status(204).send();
  },
};
