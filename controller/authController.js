import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";

/**
 * Returns a JWT token, signed with the app secret.
 *
 * @param {string} id - The user ID to include in the token.
 * @return {string} The signed JWT token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

/**
 * Creates a JWT token and sends it as a cookie in the response.
 *
 * @param {Object} user - The user to be signed into.
 * @param {number} statusCode - The HTTP status code of the response.
 * @param {Object} res - The Express response object.
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const isDev = process.env.NODE_ENV === "development" ? false : true;

  const cookieOptions = {
    expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    security: isDev,
  };
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    data: user,
  });
};

// MEMBUAT FUNGSI REGISTER, KETIKA MEMBUAT USER PERTAMA KALI ROLE NYA ADALAH ADMIN DAN SELANJUTNYA USER, DAN FUNGSI INI AKAN DI EKSEKUSI DENGAN MENGGUNAKAN ASYNC HANDLER, DATA NYA DI AMBIL DARI REQUEST BODY
export const registerUser = asyncHandler(async (req, res) => {
  const isAdmin = (await User.countDocuments()) === 0;

  const role = isAdmin ? "admin" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: role,
  });

  createSendToken(createUser, 200, res);
});

export const loginUser = asyncHandler(async (req, res) => {
  // VALIDASI APAKAH EMAIL DAN PASSWORD DIISI ATAU TIDAK
  if (!req.body.email || !req.body.password) {
    res.status(400);
    throw new Error("Email and password must be require");
  }

  // CEK APAKAH EMAIL YANG DI INPUT ADA DI DATABASE ATAU TIDAK
  const userData = await User.findOne({
    email: req.body.email,
  });

  // CEK APAKAH PASSWORD DI DATABASE BENAR ATAU TIDAK

  if (userData && (await userData.comparePassword(req.body.password))) {
    createSendToken(userData, 200, res);
  } else {
    res.status(400);

    throw new Error("Invalid email or password");
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

export const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    message: "Logout Success",
  });
};
