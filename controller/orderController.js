import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, phone, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  let orderItem = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      res.status(404);
      throw new Error("Product not found");
    }

    const { name, price, _id } = productData;
    const singleProduct = {
      quantity: cart.quantity,
      name,
      price,
      product: _id,
    };

    orderItem = [...orderItem, singleProduct];

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

  return res.status(200).json({
    message: "Create Order Success",
    order,
    total,
    // data: newOrder,
  });
});

export const allOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();

  return res.status(200).json({
    message: "Get All Order Success",
    data: orders,
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const detailOrder = await Order.findById(req.params.id);

  if (detailOrder) {
    res.status(200).json({
      message: "Get Detail Order Success",
      data: detailOrder,
    });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }

  // res.send("Get Detail Order Success");
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user.id });

  return res.status(200).json({
    message: "Get Current User Order Success",
    data: order,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const deleteOrder = await Order.findByIdAndDelete({ _id: req.params.id });

  if (!deleteOrder) {
    return next({
      message: "Order Not Found",
      statusCode: 404,
    });
  }

  return res.status(200).json({
    message: "Delete Order Success",
  });
});
