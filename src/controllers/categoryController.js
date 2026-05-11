const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: 'Could not fetch categories',
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: 'Could not fetch category',
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({
      message: 'Could not create category',
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(400).json({
      message: 'Could not update category',
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.status(200).json({
      message: 'Category deleted',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Could not delete category',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};