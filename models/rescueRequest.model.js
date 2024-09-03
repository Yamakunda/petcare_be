const mongoose = require("mongoose");

const rescueRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      default: "anonymous",
    },
    ReceiveTime: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
      default: []
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
    },

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const  rescueRequest = mongoose.model("RescueRequest", rescueRequestSchema, "rescuerequests");

module.exports = rescueRequest ;