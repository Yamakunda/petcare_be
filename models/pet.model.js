const mongoose = require("mongoose");
const petSchema = new mongoose.Schema(
  {
    petName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    race: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    adoptStatus: {
      type: String,
      required: true,
      default: "Chưa có chủ",
    },
    recieveDay: {
      type: Date,
      required: true,
      default: Date.now,
    },
    vaccinated: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      public_id: {
        type: [String],
        required: true,
        default: ["null"],
      },
      url: {
        type: [String],
        required: true,
        default: ["https://res.cloudinary.com/dzm879qpm/image/upload/v1724509562/defautProduct_mlmwsw.png"],
      }
    },
    // THONG TIN NGUOI NHAN NUOI
    userName: {
      type: String,
      required: true,
      default: "anonymous",
    },
    phoneNumber: {
      type: String,
      required: true,
      default: "anonymous",
    },
    address: {
      type: String,
      required: true,
      default: "anonymous",
    },
    resquestDay: {
      type: Date,
      required: true,
      default: Date.now,
    },
    adoptDay: {
      type: Date,
      required: true,
      default: Date.now,
    },
    requestStatus: {
      type: String,
      required: true,
      default: "Chờ xác nhận",
    },
    message: {
      type: String,
      required: true,
      default: "Chưa có lời nhắn",
    },
    employeeName : {
      type: String,
      required: true,
      default: "Chưa được xử lý",
    },
    employeeId : {
      type: String,
      required: true,
      default: "anonymous",
    },
    recieveDay: {
      type: Date,
      required: true,
      default: Date.now,
    },




  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Pet = mongoose.model("Pet", petSchema, "pets");

module.exports = Pet ;