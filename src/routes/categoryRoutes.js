const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const { requireAuth } = require('../middleware/auth')

router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getCategoryById)
router.post('/', requireAuth, categoryController.createCategory)
router.put('/:id', requireAuth, categoryController.updateCategory)
router.delete('/:id', requireAuth, categoryController.deleteCategory)

module.exports = router
