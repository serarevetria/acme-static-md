import express, { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MulterError } from 'multer';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

import pageRoutes from "./routes/page.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/pages", pageRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is working" });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(<ErrorRequestHandler>((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof MulterError) {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: "Internal Server Error" });
}));


if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export { app };
