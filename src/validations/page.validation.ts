import { z } from "zod";

export const CreatePageSchema = z.object({
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^[a-zA-Z0-9\/\-]+$/, "Path contains invalid characters")
    .refine((val) => !val.includes(".."), {
      message: 'Path cannot contain ".."',
    })
    .refine((val) => !val.startsWith("/") && !val.endsWith("/"), {
      message: 'Path cannot start or end with "/"',
    }),
  file: z.object({
    originalname: z.string(),
    buffer: z.instanceof(Buffer),
  }),
});

export const GetPageSchema = z.object({
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^[a-zA-Z0-9\/\-]+$/, "Invalid path format")
    .refine((val) => !val.includes(".."), {
      message: 'Path cannot contain ".."',
    }),
});
