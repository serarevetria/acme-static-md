import { Router } from "express";
import {
  getAllPages,
  createPage,
  getPage,
} from "../controllers/page.controller";
import multer from "multer";
import { validateCreatePage } from "../middleware/validateCreatePage";
import { validateGetPage } from "../middleware/validateGetPage";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/markdown") {
      cb(null, true);
    } else {
      const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      error.message = 'Only markdown files are allowed.';
      cb(error);
    }
  },
});

router.get("/", getAllPages);

router.post("/", upload.single("file"), validateCreatePage, createPage);

router.get("/*path", validateGetPage, getPage);

export default router;
