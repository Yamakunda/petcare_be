const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
      default: generate.generateRandomNumber(4)
    },
    job: {
      type: String,
      required: true,
      default: "register"
    },
    createDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    expireDate: {
      type: Date,
      required: true,
      default: Date.now() + 1000 * 60 * 3
    }
  }
);

const Otp = mongoose.model("Otp", otpSchema, "otps");

module.exports = Otp;