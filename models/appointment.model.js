const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      default: "anonymous",
    },
    user_id: {
      type: String,
      required: true,
      default: "1111",
    },
    doctorName: {
      type: String,
      required: true,
      default: "anonymous",
    },
    doctor_id: {
      type: String,
      required: true,
      default: "11111",
    },
    phone: {
      type: String,
      required: true,
      default: "anonymous",
    },
    address: {
      type: String,
      required: true,
      default: "anonymous",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    time: {
      type: String,
      required: true,
      default: "anonymous",
    },
    petAge: {
      type: String,
      required: true,
      default: "anonymous",
    },
    weight: {
      type: String,
      required: true,
      default: "anonymous",
    },
    petGender: {
      type: String,
      required: true,
      default: "anonymous",
    },
    service: {
      type: String,
      required: true,
      default: "anonymous",
    },
    status: {
      type: String,
      required: true,
      default: "...",
    },
    note: {
      type: String,
      required: true,
      default: "...",
    },

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");

module.exports = Appointment ;