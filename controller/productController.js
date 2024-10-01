import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

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
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  let countProduct = await Product.countDocuments(query);
  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404);
      throw new Error("This page doesnt exist");
    }
  }

  const data = await query;

  res.status(200).json({
    message: "Get All Product Success",
    data,
    count: countProduct,
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
  const file = req.file;

  if (!file) {
    res.status(400);

    throw new Error("No image uploaded");
  }

  const imageFileName = file.filename;
  const pathImageFile = `/uploads/${imageFileName}`;

  res.status(200).json({
    message: "Image Upload Success",
    image: pathImageFile,
  });
});
