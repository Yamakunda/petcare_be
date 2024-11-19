const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      default: "unknown",
    },
    user_id: {
      type: String,
      required: true,
      default: "unknown",
    },
    userEmail: {
      type: String,
      required: true,
      default: "unknown",
    },
    doctorName: {
      type: String,
      required: true,
      default: "unknown",
    },
    doctor_id: {
      type: String,
      required: true,
      default: "unknown",
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please fill a valid phone number with 10 digits'],
    },
    address: {
      type: String,
      required: true,
      default: "unknown",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    time: {
      type: String,
      required: true,
      default: "unknown",
    },
    petAge: {
      type: String,
      required: true,
      default: "unknown",
    },
    weight: {
      type: String,
      required: true,
      default: "unknown",
    },
    petGender: {
      type: String,
      required: true,
      default: "unknown",
    },
    service: {
      type: String,
      required: true,
      default: "unknown",
    },
    status: {
      type: String,
      required: true,
      default: "Chưa xử lý",
    },
    note: {
      type: String,
      required: false,
      default: "Chưa có lời nhắn",
    },
    doctorMessage: {
      type: String,
      required: false,
      default: "Chưa có lời nhắn",
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    service: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");

module.exports = Appointment ;