const mongoose = require("mongoose");
const adoptSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    petName: {
      type: String,
      required: true,
    },
    petId: {
      type: String,
      required: true,
    },

    adoptStatus: {
      type: String,
      required: true,
    },
    resquestDay: {
      type: Date,
      required: true,
    },

    image: {
      type: [String],
      required: true,
      default: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg"]
    },
    message: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Adopt = mongoose.model("Adopt", adoptSchema, "adopts");

module.exports = Adopt ;