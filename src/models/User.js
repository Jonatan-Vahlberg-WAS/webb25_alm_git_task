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

userSchema.post('save', async function () {
  await Mail.create({
    status: 'welcome',
    user: {
      name: this.name,
      email: this.email,
    },
  });
});

module.exports = mongoose.model('User', userSchema);