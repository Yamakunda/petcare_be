const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: {
      type: String,
      default: generate.generateRandomNumber(4)
    },
    createDate: {
      type: Date,
      default: Date.now
    },
  }
);

const Otp = mongoose.model("Otp", otpSchema, "otps");

module.exports = Otp;