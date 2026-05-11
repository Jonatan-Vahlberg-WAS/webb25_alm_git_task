const express = require('express')
const { updateCategory, deleteCategory, getCategory } = require('../controllers/categoryController')

const router = express.Router()



router.get('/', getCategory)
router.get('/:id')
router.post('/')
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
