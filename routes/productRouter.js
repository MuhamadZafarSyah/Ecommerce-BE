import express from "express";

import {
  createProducut,
  allProduct,
  detailProduct,
  updateProduct,
  deleteProduct,
  fileUpload,
} from "../controller/productController.js";

import {
  protectedMiddleware,
  adminMidldeware,
} from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const router = express.Router();

// GET ALL PRODUCT
router.get("/", allProduct);

// DETAIL PRODUCT
router.get("/:id", detailProduct);

// CREATE PRODUCT
router.post("/", protectedMiddleware, adminMidldeware, createProducut);

router.put("/:id", protectedMiddleware, adminMidldeware, updateProduct);

router.delete("/:id", protectedMiddleware, adminMidldeware, deleteProduct);

router.post(
  "/file-upload",
  protectedMiddleware,
  adminMidldeware,
  upload.single("image"),
  fileUpload
);

export default router;
