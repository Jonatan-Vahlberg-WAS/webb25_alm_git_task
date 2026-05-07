const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      validate: {
        validator: () => !this.name,
        message: "Name required",
      },
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      validate: {
        validator: (value) => value >= 0,
        message: "Price cannot be negative values"
        
      }
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
