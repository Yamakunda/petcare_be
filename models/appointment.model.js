const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    doctor_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema, "appointments");

module.exports = Appointment ;