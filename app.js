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

dotenv.config();

const app = express();
const port = 3000;

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
