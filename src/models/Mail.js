const mongoose = require('mongoose')
const User = require('./User')

const mailSchema = new mongoose.Schema(
  {
    subject: {
      type: String
    },
    status: {
      type: String,
      enum: ['welcome']
    },
    content: {
      type: String
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
)

mailSchema.pre('save', async function (next) {
  if (this.status === 'welcome') {
    const user = await mongoose.model('User').findById(this.user)

    if (user?.name) {
      this.subject = `Välkommen ${user.name}! Ditt konto är skapat`
      this.content = `Hej ${user.name}, välkommen! Ditt konto med e-postadressen ${user.email} har skapats. Vi är glada att ha dig med oss.`
    } else {
      this.subject = 'Välkommen! Ditt konto är skapat'
      this.content = `Hej, välkommen! Ditt konto med e-postadressen ${user.email} har skapats. Vi är glada att ha dig med oss.`
    }
  }
  
  next()
})

module.exports = mongoose.model('Mail', mailSchema)
