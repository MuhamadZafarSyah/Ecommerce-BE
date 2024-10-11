import express from "express";
import authRouter from "./routes/authRouter.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();
const port = 3000;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`Express listening on port ${port}`);
});

app.get("/", function (req, res) {
  res.status(200).json({
    message: "Selamat datang di Ecommrce kami",
    developer: "muhamad Zafar Syah",
    auth: {
      name: "Authentikasi",
      request: {
        url: "https://ecommercebe.vercel.app/api/v1/auth",
        path: ["login", "register", "logout", "getuser"],
      },
    },
    produk: {
      name: "CRUD Produk",
      request: {
        url: "https://ecommercebe.vercel.app/api/v1",
        path: ["product", "product/1"],
        method: ["GET", "POST", "PUT", "DELETE"],
      },
    },
    order: {
      name: "CRUD Order",
      request: {
        url: "https://ecommercebe.vercel.app/api/v1",
        path: ["order", "order/current/user"],
        method: ["GET", "POST", "DELETE"],
      },
    },
  });
});

// PARENT DARI ROUTE AUTH
app.use("/api/v1/auth", authRouter);

// PARENT DARI ROUTE CRUD PRODUCT
app.use("/api/v1/product", productRouter);

// PARENT DARI ROUTE CRUD ORDER
app.use("/api/v1/order", orderRouter);

// CONNECT DATABASE
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("Berhasil Connect");
});

app.use(notFound);
app.use(errorHandler);
