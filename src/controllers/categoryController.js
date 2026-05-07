const Category = require('../models/Category')

const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        if(!category) {
            res.status(404).json({ message: "Categories not found"});
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch categories"})
    }
}

const getCategoryById = () => {}
const createCategory = () => {}
const updateCategory = () => {}
const deleteCategory = () => {}
