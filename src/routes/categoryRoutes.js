const express = require('express')
const { updateCategory, deleteCategory, getCategory, getCategoryById } = require('../controllers/categoryController')

const router = express.Router()

router.get('/', getCategory)
router.get('/:id', getCategoryById)
// TODO: Implement createCategory fn från categoryController.js
//router.post('/')
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
