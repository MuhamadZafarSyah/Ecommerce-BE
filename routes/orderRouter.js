import express from "express";

import {
  createOrder,
  allOrder,
  detailOrder,
  currentUserOrder,
  deleteOrder,
  callbackPayment,
} from "../controller/orderController.js";

import {
  protectedMiddleware,
  adminMidldeware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// MENGAMBIL DATA ORDER HANYA ADMIN
router.get("/", protectedMiddleware, adminMidldeware, allOrder);

// MEMBUAT ORDER HARUS LOGIN
router.post("/", protectedMiddleware, createOrder);

router.get("/:id", protectedMiddleware, adminMidldeware, detailOrder);

router.get("/current/user", protectedMiddleware, currentUserOrder);

router.delete("/:id", protectedMiddleware, deleteOrder);

router.post("/callback/midtrans", callbackPayment);

export default router;
