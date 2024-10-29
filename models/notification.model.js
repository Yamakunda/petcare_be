const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    content: {
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
const Notification = mongoose.model("Notification", notificationSchema, "notifications");

module.exports = Notification ;