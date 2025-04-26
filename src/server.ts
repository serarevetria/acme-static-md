import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
