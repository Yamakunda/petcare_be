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
    userEmail: {
      type: String,
      required: true,
      default: "anonymous",
    },
    doctorName: {
      type: String,
      required: true,
      default: "anonymous",
    },
    doctor_id: {
      type: String,
      required: true,
      default: "anonymous",
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Please fill a valid phone number with 10 digits'],
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
    

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");

module.exports = Appointment ;