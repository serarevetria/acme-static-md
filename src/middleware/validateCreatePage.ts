import { Request, Response, NextFunction } from "express";
import { CreatePageSchema } from "../validations/page.validation";
import { ZodError } from "zod";

export const validateCreatePage = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    CreatePageSchema.parse({ ...req.body, file: req.file });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res
        .status(400)
        .json({ message: "Validation Error", details: error.issues });
      return;
    }
    res
      .status(400)
      .json({ message: "Validation Error", details: (error as Error).message });
  }
};
