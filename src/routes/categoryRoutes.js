const express = require('express')
const { updateCategory, deleteCategory, getCategory, getCategoryById, createCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/', getCategory)
router.get('/:id', getCategoryById)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
