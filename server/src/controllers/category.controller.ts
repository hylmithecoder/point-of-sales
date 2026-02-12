import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service.ts";

export const CategoryController = {
  findAllCategories: async (req: Request, res: Response) => {
    res.json(await CategoryService.findAllCategories());
  },

  findCategoryById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const category = await CategoryService.findCategoryById(id);
    res.json(category);
  },

  createCategory: async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const payload = {
      name: req.body.name,
      description: req.body.description,
      image: req.file,
    };

    const category = await CategoryService.createCategory(payload);
    res.status(201).json(category);
  },

  updateCategory: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const payload = {
      name: req.body.name,
      description: req.body.description,
      image: req.file,
    };

    const category = await CategoryService.updateCategory(id, payload);
    res.status(201).json(category);
  },

  deleteCategory: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await CategoryService.deleteCategory(id);
    res.status(204).send();
  },
};
