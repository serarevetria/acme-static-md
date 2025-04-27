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
    const allowedExtensions = ['.md'];

    const isMarkdown = allowedExtensions.some(ext =>
      file.originalname.toLowerCase().endsWith(ext)
    );

    if (isMarkdown) {
      cb(null, true);
    } else {
      cb(new Error('Only markdown (.md) files are allowed!'));
    }
  },
});


router.get("/", getAllPages);

router.post("/", upload.single("file"), validateCreatePage, createPage);

router.get("/*path", validateGetPage, getPage);

export default router;
