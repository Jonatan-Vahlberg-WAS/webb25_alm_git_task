const User = require('../models/User')
const { signToken } = require('../middleware/auth')
const { formatMongooseValidation } = require('../utils/validation')

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (email === undefined || email === '' || password === undefined || password === '') {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await User.create({ email, password, name: name ?? '' })
    const token = signToken(user._id)
    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: formatMongooseValidation(error) })
    }
    return res.status(500).json({ message: 'Could not register user' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email === undefined || email === '' || password === undefined || password === '') {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const ok = await user.comparePassword(password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    const token = signToken(user._id)
    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    })
  } catch {
    return res.status(500).json({ message: 'Could not log in' })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ id: user._id, email: user.email, name: user.name })
  } catch {
    return res.status(500).json({ message: 'Could not load profile' })
  }
}

const updateMe = async (req, res) => {
  try {
    const { name } = req.body
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (name !== undefined) {
      user.name = name
    }
    await user.save()
    return res.status(200).json({ id: user._id, email: user.email, name: user.name })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: formatMongooseValidation(error) })
    }
    return res.status(500).json({ message: 'Could not update profile' })
  }
}

module.exports = {
  register,
  login,
  me,
  updateMe
}
