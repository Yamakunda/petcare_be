
const mongoose = require("mongoose");
const newsSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      default: "12323",
    },
    title: {
      type: String,
      required: true,

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
    content: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const News = mongoose.model("News", newsSchema, "news");

module.exports = News ;