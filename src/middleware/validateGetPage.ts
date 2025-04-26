import { Request, Response, NextFunction } from "express";
import { GetPageSchema } from "../validations/page.validation";
import { ZodError } from "zod";

export const validateGetPage = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const pathParam = req.params.path;
    const path = Array.isArray(pathParam) ? pathParam.join("/") : pathParam;
    GetPageSchema.parse({ path });
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
