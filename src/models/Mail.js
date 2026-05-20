const mongoose = require('mongoose')

const mailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['welcome'],
      default: 'welcome',
      required: [true, 'Status is required']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Mail', mailSchema)
