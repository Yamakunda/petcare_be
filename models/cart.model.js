const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product_list: [
      {
        product_id: {
          type: String,
          required: true,
        },
        product_image:{
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          // Giá của 1 sản phẩm chưa giảm giá
          type: Number,
          required: true,
        },
        discount_price: {
          // Giá của 1 sản phẩm đã giảm giá
          type: Number,
          required: true,
        }
      },
    ],

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    default: [], // Set default value for product_list
  }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart ;