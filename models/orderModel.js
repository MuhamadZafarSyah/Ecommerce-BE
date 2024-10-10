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
    required: [true, "Nama depan harus diisi"],
  },
  lastName: {
    type: String,
    required: [true, "Nama belakang harus diisi"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor handphone harus diisi"],
  },
  total: {
    type: Number,
    required: [true, "Total harus diisi"],
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
