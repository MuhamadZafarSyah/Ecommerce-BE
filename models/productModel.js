import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  image: {
    type: String,
    default: null,
  },

  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["sepatu", "kemeja", "baju", "celana", "topi", "hoodie"],
  },

  stock: {
    type: Number,
    default: null,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
