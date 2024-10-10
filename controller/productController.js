import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createProducut = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(200).json({
    message: "Berhasil membuat data produk",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeField = ["page", "limit", "name"];
  excludeField.forEach((element) => delete queryObj[element]);

  let query = {};

  if (req.query.name) {
    // Membuat regex pattern yang lebih fleksibel
    const searchTerms = req.query.name
      .split(" ")
      .filter((term) => term.length > 0);
    if (searchTerms.length > 0) {
      query.name = {
        $regex: searchTerms.map((term) => `(?=.*${term})`).join(""),
        $options: "i", // 'i' untuk case-insensitive
      };
    }
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  const finalQuery = { ...query, ...queryObj };

  // PAGINATION
  const page = parseInt(req.query.page) || 1;
  const limitData = parseInt(req.query.limit) || 6;
  const skipData = (page - 1) * limitData;

  const countProduct = await Product.countDocuments(finalQuery);
  const totalPage = Math.ceil(countProduct / limitData);

  if (page > totalPage) {
    res.status(404);
    throw new Error("Halaman ini tidak tersedia");
  }

  const data = await Product.find(finalQuery).skip(skipData).limit(limitData);

  res.status(200).json({
    message: "Berhasil mendapatkan semua data produk",
    data,
    pagination: {
      totalPage,
      currentPage: page,
      totalProduct: countProduct,
    },
  });
});
export const detailProduct = asyncHandler(async (req, res) => {
  const detailProduct = await Product.findById(req.params.id);

  if (detailProduct) {
    res.status(200).json({
      message: "Berhasil mendapatkan detail data produk",
      data: detailProduct,
    });
  } else {
    res.status(404).json({
      message: "Data produk tidak ditemukan",
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
      message: "Data produk tidak ditemukan",
    });
  }

  res.status(200).json({
    message: "Berhasil update data produk",
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
