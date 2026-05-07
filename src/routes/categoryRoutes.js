const express = require('express')
const { getAllCategory } = require('../controllers/categoryController')

const router = express.Router()

router.get('/', getAllCategory)
router.get('/:id')
router.post('/')
router.put('/:id')
router.delete('/:id')

module.exports = router
