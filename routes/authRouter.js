import express from "express";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../controller/authController.js";
import protectedMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/getuser", protectedMiddleware, getCurrentUser);

// LOGOUT
router.get("/logout", protectedMiddleware, logoutUser);

export default router;
