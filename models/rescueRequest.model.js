const mongoose = require("mongoose");

const rescueRequestSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      default: "anonymous",
    },
    RequestTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
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
        default: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"],
      }
    },
    location: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    requestStatus: {
      type: String,
      required: true,
      default: "Chờ xác nhận",
    },
    employeeName: {
      type: String,
      required: true,
      default: "chưa",
    },
    employeeId: {
      type: String,
      required: true,
      default: "chưa",
    },

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const  rescueRequest = mongoose.model("RescueRequest", rescueRequestSchema, "rescuerequests");

module.exports = rescueRequest ;