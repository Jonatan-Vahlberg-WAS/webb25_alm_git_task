const Product = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    let { name } = req.query;
    let categories = await Category.find();
    if (name && name.trim() !== "") {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not fetch categries", error: error.message });
  }
};

const getCategoryById = async (res, req) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Couldn't find category" });
    }

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Coldn't get category", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Couldn't create categortý", error: error.message });
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
      },
    );

    if (!updateCategory) {
      return res.status(404).json({ message: "Couldn't find category" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Couldn't update category", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id)

        if (!deletedCategory) {
            return res.status(404).json({ message: "Couldn't find category"})
        }

        res.status(200).json({ message: "Category deleted"})
    } catch (error) {
        res.status(500)
        .json({ message: "Couldn't delete category", error: error.message })
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}