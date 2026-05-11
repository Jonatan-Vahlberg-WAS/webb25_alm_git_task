const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    price: {
      type: Number,
      min: 0,
      required: [true, 'Product price is required']
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Category",
      required: false,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Product', productSchema)
