const mongoose = require('mongoose');
const Mail = require('./Mail');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.post('save', async function (doc, next) {
  if (doc.isNew) {
    await Mail.create({
      status: 'welcome',
      user: doc._id,
    });
  }

  next();
});

module.exports = mongoose.model('User', userSchema);