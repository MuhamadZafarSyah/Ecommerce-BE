import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Midtrans from "midtrans-client";
import dotenv from "dotenv";

dotenv.config();

let snap = new Midtrans.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Keranjang Kosong");
  }

  let orderItem = [];
  let orderMidtrans = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("Produk tidak ditemukan");
    }

    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };

    const shortName = name.substring(0, 30);

    const singleProductMidtrans = {
      id: _id,
      name: shortName,
      price,
      quantity: cart.quantity,
    };

    orderItem = [...orderItem, singleProduct];
    orderMidtrans = [...orderMidtrans, singleProductMidtrans];

    total += cart.quantity * price;
  }

  const order = await Order.create({
    itemsDetail: orderItem,
    total,
    user: req.user._id,
    email,
    firstName,
    lastName,
    phone,
  });

  let parameter = {
    transaction_details: {
      order_id: order._id,
      gross_amount: total,
    },
    itemsDetail: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    },
  };

  const token = await snap.createTransaction(parameter);

  return res.status(200).json({
    message: "Berhasil membuat orderan",
    order,
    total,
    token,
  });
});

export const allOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    message: "Berhasil mendapat semua orderan",
    data: orders,
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const detailOrder = await Order.findById(req.params.id);

  if (detailOrder) {
    res.status(200).json({
      message: "Berhasil mendapat detail orderan",
      data: detailOrder,
    });
  } else {
    res.status(404);
    throw new Error("Orderan tidak ditemukan ");
  }

  // res.send("Get Detail Order Success");
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user.id });

  return res.status(200).json({
    message: "Berhasil mendapat orderan user saat ini",
    data: order,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const deleteOrder = await Order.findByIdAndDelete({ _id: req.params.id });

  if (!deleteOrder) {
    return next({
      message: "Orderan tidak ditemukan",
      statusCode: 404,
    });
  }

  return res.status(200).json({
    message: "Berhasil hapus orderan",
  });
});
