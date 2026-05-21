const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Mail = require('./Mail')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    name: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  this.wasNew = this.isNew

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  next()
})

userSchema.post('save', async function (doc) {
  if (this.wasNew) {
    await Mail.create({
      subject: 'Welcome',
      status: 'welcome',
      content: `Welcome ${doc.name || doc.email}!`,
      user: doc._id,
    })
  }
})

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
