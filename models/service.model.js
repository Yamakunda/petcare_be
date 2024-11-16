const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "Không có mô tả",
    },
    status: {
      type: String,
      required: true,
      default: "active",
    },
    image: {
      public_id: {
        type: [String],
        required: true,
        default: ["null"],
      },
      url: {
        type: [String],
        required: true,
        default: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg"],
      }
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Service = mongoose.model("Service", serviceSchema, "services");

module.exports = Service;