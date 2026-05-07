const Category = require('../models/Category')

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find()
    if (!categories) {
      res.status(404).json({ message: 'Categories not found' })
    }
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch categories' })
  }
}

const getCategoryById = () => {}
const createCategory = () => {}
const updateCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json(updatedCategory)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid category data' })
    }
    res.status(500).json({ message: 'Could not update category' })
  }
}
const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category ID' })
    }
    const deletedCategory = await Category.findByIdAndDelete(req.params.id)

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' })
    }
    res.status(200).json({ message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete Category' })
  }
}

module.exports = {
  updateCategory,
  deleteCategory,
  getCategory
}
