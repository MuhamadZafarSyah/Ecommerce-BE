import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createProducut = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(200).json({
    message: "Create Product Success",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeField = ["page", "limit"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query = {};

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: "i" };
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  // Gabungkan semua filter
  const finalQuery = { ...query, ...queryObj };

  let productQuery = Product.find(finalQuery);

  // PAGINATION
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 10;
  const skipData = (page - 1) * limitData;

  productQuery = productQuery.skip(skipData).limit(limitData);

  const countProduct = await Product.countDocuments(finalQuery);

  if (req.query.page && skipData >= countProduct) {
    res.status(404);
    throw new Error("This page doesn't exist");
  }

  const data = await productQuery;
  const totalPage = Math.ceil(countProduct / limitData);

  res.status(200).json({
    message: "Get All Product Success",
    data,
    pagination: {
      totalPage,
      page,
      totalProduct: countProduct,
    },
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const detailProduct = await Product.findById(req.params.id);

  if (detailProduct) {
    res.status(200).json({
      message: "Get Detail Product Success",
      data: detailProduct,
    });
  } else {
    res.status(404).json({
      message: "Product Not Found",
    });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const paramId = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(paramId, req.body, {
    runValidators: false,
    new: true,
  });

  if (!updateProduct) {
    res.status(404).json({
      message: "Product Not Found",
    });
  }

  res.status(200).json({
    message: "Update Product Success",
    data: updateProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete({ _id: req.params.id });

  if (!product) {
    return next({
      message: "Product Not Found",
      statusCode: 404,
    });
  }

  res.status(200).json({
    message: "Delete Product Success",
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "products",
      allowed_formats: ["jpg", "png", "webp"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Upload Failed",
          error: err,
        });
      }

      return res.status(200).json({
        message: "Upload Success",
        url: result.secure_url,
      });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
