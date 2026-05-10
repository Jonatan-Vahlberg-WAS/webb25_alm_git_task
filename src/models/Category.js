const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    // TODO: Add validation
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      max: 20,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Category", categorySchema)