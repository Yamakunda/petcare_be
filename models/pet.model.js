const mongoose = require("mongoose");
const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pet_id: {
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
    },
    recieveDay: {
      type: Date,
      required: true,
    },
    vaccinated: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: {
      type: [String],
      required: true,
      default: []
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Pet = mongoose.model("Pet", petSchema, "pets");

module.exports = Pet ;