const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Mail = require('./Mail.js')

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

userSchema.pre('save', async function hashPassword(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  this.wasNew = this.isNew

  return next()
})

userSchema.post('save', async function (doc) {
  if (doc.wasNew) {
    await Mail.create({
      status: 'welcome',
      user: doc._id
    })
  }else {
    console.log("User updated, not new")
  }
})

/**
 * @param {string} candidate
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
