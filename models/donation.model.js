const mongoose = require("mongoose");
const donationSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Donation = mongoose.model("Donation", donationSchema, "donations");

module.exports = Donation ;