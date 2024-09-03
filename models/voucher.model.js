const mongoose = require("mongoose");
VOUCHER(VoucherID, UsedTime, Name, StartTime, EndTime, Value, Description, EmployeeID)
const voucherSchema = new mongoose.Schema(
  {
    employee_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    UsedTime:{
      type: Number,
      required: true,
    },
    beginDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
    },
    discount_value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");

module.exports = Voucher ;