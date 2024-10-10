import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "Harga harus diisi"],
  },

  description: {
    type: String,
    required: [true, "Deskripsi harus diisi"],
  },

  image: {
    type: String,
    default: null,
  },

  category: {
    type: String,
    required: [true, "Kategori harus diisi"],
    enum: ["sepatu", "kemeja", "baju", "celana", "topi", "hoodie"],
  },

  stock: {
    type: Number,
    default: null,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
