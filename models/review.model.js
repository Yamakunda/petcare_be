const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    image: {
      type: [String],
      required: true,
      default: []
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review ;