const Category = require('../models/Category')

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message })
  }
}

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json(category)
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category id' })
    }
    res.status(500).json({ message: 'Failed to fetch category', error: err.message })
  }
}

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body)
    const saved = await category.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json(updated)
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category id' })
    }
    res.status(500).json({ message: 'Failed to update category', error: err.message })
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(204).send()
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category id' })
    }
    res.status(500).json({ message: 'Failed to delete category', error: err.message })
  }
}