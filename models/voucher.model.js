const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "1",
    },
    quantity: {
      type: Number,
      required: true,
      default: "1",
    },
    UsedTime: {
      type: Number,
      required: true,
      default: "0",
    },
    beginDate: {
      type: Date,
      required: true,
      default: Date.now, // Default to the current date and time
    },
    endDate: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 7*24*60*60*1000), // Default to one week from now
    },
    code: {
      type: String,
      required: true,
      default: "",
    },
    discount_type: {
      type: String,
      required: true,
      default: "phantram",
    },
    discount_value: {
      value: {
        type: Number,
        required: true,
        default: "0",
      },
      min_require: {
        type: Number,
        required: true,
        default: "0",
      },
      max_discount: {
        type: Number,
        required: true,
        default: "0",
      },
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    employee_id: {
      type: String,
      required: true,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");

module.exports = Voucher;