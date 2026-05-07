const express = require('express')
const { getCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/', getCategory)
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')

module.exports = router
