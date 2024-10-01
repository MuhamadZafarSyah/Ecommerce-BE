import mongoose from "mongoose";

const { Schema } = mongoose;

const singleProduct = Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const orderSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  total: {
    type: Number,
    required: [true, "Total is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Failed", "Success"],
    default: "Pending",
  },
  itemsDetail: [singleProduct],
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
