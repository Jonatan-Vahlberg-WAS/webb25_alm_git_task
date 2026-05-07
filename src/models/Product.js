const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: [true, "Product name is required"],

      trim: true,
    },

    price: {
      type: Number,

      required: [true, "Product price is required"],

      min: [0, "Price must be equal to 0 or higher"],
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
