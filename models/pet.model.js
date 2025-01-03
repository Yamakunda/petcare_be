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
      default: Date.now(),
    },
    vaccinated: {
      type: String,
      required: true,
      default: "Đã tiêm phòng",
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
        default: ["https://ik.imagekit.io/yamakun/No_Image_Available.jpg"],
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
      default: Date.now(),
    },
    adoptDay: {
      type: Date,
      required: true,
      default: Date.now(),
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
      default: Date.now(),
    },
    arriveDay: {
      type: Date,
      required: false,
      default: null,
    },
    method: {
      type: String,
      required: true,
      default: "Chưa có phương thức",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Pet = mongoose.model("Pet", petSchema, "pets");

module.exports = Pet ;