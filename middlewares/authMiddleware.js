import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

export const protectedMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decode.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Tidak diizinkan, token gagal");
    }
  } else {
    res.status(401).json({ message: "Tidak diizinkan, tidak ada token" });
  }
});

export const adminMidldeware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Tidak di izinkan, anda bukan admin!");
  }
};

export default protectedMiddleware;
