const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      required: true,
      default: "0%",
    },
    description: {
      type: String,
      required: true,
      default: "Không có mô tả",
    },
    status: {
      type: String,
      required: true,
      default: "Hoạt động",
    },
    image: {
      type: [String],
      required: true,
      default: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;