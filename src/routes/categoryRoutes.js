const express = require('express')
const { updateCategory, deleteCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/')
router.get('/:id')
router.post('/')
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
