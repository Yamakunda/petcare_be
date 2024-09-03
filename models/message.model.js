const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    sender_id: {
      type: String,
      required: true,
    },
    receiver_id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sendTime: {
      type: Date,
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

const Message = mongoose.model("Message", messageSchema, "messages");

module.exports = Message ;