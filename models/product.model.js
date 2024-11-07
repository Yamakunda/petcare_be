const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    purchased:{
      type: Number,
      required: true,
      default: 0,
    },
    brand: {
      type: String,
      required: true,
      default: "Không có",
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 5,
    },
    discount: {
      type: String,
      required: true,
      default: "0%",
    },
    discount_price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      default: "Không có mô tả",
    },
    status: {
      type: String,
      required: true,
      default: "active",
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
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
// Pre-save hook to calculate discount_price

// Function to calculate discount_price
function calculateDiscountPrice() {
  const discountPercentage = parseFloat(this.discount) / 100;
  this.discount_price = Math.round(this.price - (this.price * discountPercentage));
  // console.log(`Calculated discount_price: ${this.discount_price}`); // Debug log
}

// Pre-save hook to calculate discount_price
productSchema.pre('save', function(next) {
  calculateDiscountPrice.call(this);
  next();
});

// Pre-update hooks to calculate discount_price
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.price || update.discount) {
    const discountPercentage = parseFloat(update.discount) / 100;
    update.discount_price = Math.round(update.price - (update.price * discountPercentage));
    // console.log(`Calculated discount_price: ${update.discount_price}`); // Debug log
  }
  next();
});

productSchema.pre('updateOne', function(next) {
  const update = this.getUpdate();
  if (update.price || update.discount) {
    const discountPercentage = parseFloat(update.discount) / 100;
    update.discount_price = Math.round(update.price - (update.price * discountPercentage));
    console.log(`Calculated discount_price: ${update.discount_price}`); // Debug log
  }
  next();
});
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;