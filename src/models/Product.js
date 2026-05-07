const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Product price must be a positive number'],
    },
    description: {
      type: String,
      default: '',
    },

    //  NEW: Optional category field with enum validation
    category: {
      type: String,
      enum: {
        values: ['electronics', 'clothing', 'home'],
        message: 'Invalid category. Allowed values: electronics, clothing, home',
      },
      default: undefined, 
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
