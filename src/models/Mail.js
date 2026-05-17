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

mailSchema.pre('save', async function (next) {
  if (this.status === 'welcome') {
    await this.populate('user');

    if (this.user.name) {
      this.subject = `Välkommen ${this.user.name}! Ditt konto är skapat`;

      this.content =
        `Hej ${this.user.name}, välkommen! ` +
        `Ditt konto med e-postadressen ${this.user.email} har skapats. ` +
        `Vi är glada att ha dig med oss.`;
    } else {
      this.subject = 'Välkommen! Ditt konto är skapat';

      this.content =
        `Hej, välkommen! ` +
        `Ditt konto med e-postadressen ${this.user.email} har skapats. ` +
        `Vi är glada att ha dig med oss.`;
    }
  }

  next();
});

module.exports = mongoose.model('Mail', mailSchema);