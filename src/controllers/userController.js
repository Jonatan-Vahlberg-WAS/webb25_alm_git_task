const mongoose = require('mongoose')
const User = require('../models/User')

exports.getAllUsers = async (req, res) => {
  console.log('entered getallusers')
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message })
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body)
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message })
  }
}
