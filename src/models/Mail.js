const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
    },
    status: {
      type: String,
      enum: ['welcome'],
      required: true,
    },
    content: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Mail', mailSchema);