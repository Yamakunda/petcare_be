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
      default: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Adopt = mongoose.model("Adopt", adoptSchema, "adopts");

module.exports = Adopt ;