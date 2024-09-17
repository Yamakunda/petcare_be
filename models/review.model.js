const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      default: ""
    },
    product_id: {
      type: String,
      required: true,
      default: ""
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5
    },
    image: {
      type: [String],
      required: true,
      default: []
    },
    content: {
      type: String,
      required: true,
      default: ""
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review ;