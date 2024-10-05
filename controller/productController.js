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
  // REQUEST QUERY
  const queryObj = { ...req.query };

  // Fungsi untuk mengabaikan jika ada req page dan limit
  const excludeField = ["page", "limit"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query;

  if (req.query.name) {
    query = Product.find({
      name: {
        $regex: req.query.name,
        $options: "i",
      },
    });
  } else {
    // Buat query untuk mengambil data dari database
    query = Product.find(queryObj);
  }

  // PAGINATION
  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 10;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments(queryObj);
  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("This page doesnt exist");
    }
  }

  const data = await query;
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
