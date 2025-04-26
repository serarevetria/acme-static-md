import { Request, Response, NextFunction } from "express";
import { PageService } from "../services/page.service";

const pageService = new PageService();

export const getAllPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pages = await pageService.getAllPages();
    res.status(200).json(pages);
  } catch (error) {
    next(error);
  }
};

export const createPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { path } = req.body;
    const file = req.file!;

    const content = file.buffer.toString("utf-8");

    await pageService.createPage({ path, content });

    res.status(201).json({ message: "Page created successfully." });
  } catch (error) {
    next(error);
  }
};

export const getPage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pathParam = req.params.path;
    const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;

    const content = await pageService.getPage(path);

    res.status(200).json({ content });
  } catch (error) {
    if ((error as Error).message === "Page not found.") {
      res.status(404).json({ message: "Page not found." });
      return;
    }
    next(error);
  }
};
