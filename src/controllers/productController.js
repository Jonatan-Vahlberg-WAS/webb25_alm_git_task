const mongoose = require('mongoose')
const { getFullTextSearch } = require('../utils/fullTextSearch')
const { formatMongooseValidation } = require('../utils/validation')
const Product = require('../models/Product')

const DEFAULT_SORT = { createdAt: -1 }

/**
 * @param {string | undefined} raw
 * @param {string} label
 * @returns {{ ok: true, value: number | undefined } | { ok: false, message: string }}
 */
function parsePriceBound(raw, label) {
  if (raw === undefined || raw === '') {
    return { ok: true, value: undefined }
  }
  const n = Number(raw)
  if (Number.isNaN(n)) {
    return { ok: false, message: `${label} must be a valid number` }
  }
  return { ok: true, value: n }
}

/**
 * @param {string | undefined} raw
 * @returns {{ ok: true, value: Record<string, 1 | -1> } | { ok: false, message: string }}
 */
function parseSort(raw) {
  if (raw === undefined || raw === '') {
    return { ok: true, value: DEFAULT_SORT }
  }
  const trimmed = String(raw).trim()
  const desc = trimmed.startsWith('-')
  const field = desc ? trimmed.slice(1) : trimmed
  if (field !== 'price' && field !== 'name') {
    return { ok: false, message: 'sort must be price, -price, name, or -name' }
  }
  const direction = desc ? -1 : 1
  return { ok: true, value: { [field]: direction } }
}

const getProducts = async (req, res) => {
  try {
    const { name, minPrice: minPriceRaw, maxPrice: maxPriceRaw, sort: sortRaw } = req.query
    let filter = {}

    if (name) {
      filter = {
        ...filter,
        ...getFullTextSearch(name, true, 'name')
      }
    }

    const minParsed = parsePriceBound(minPriceRaw, 'minPrice')
    if (!minParsed.ok) {
      return res.status(400).json({ message: minParsed.message })
    }
    const maxParsed = parsePriceBound(maxPriceRaw, 'maxPrice')
    if (!maxParsed.ok) {
      return res.status(400).json({ message: maxParsed.message })
    }

    const priceRange = {}
    if (minParsed.value !== undefined) {
      priceRange.$gte = minParsed.value
    }
    if (maxParsed.value !== undefined) {
      priceRange.$lte = maxParsed.value
    }
    if (Object.keys(priceRange).length) {
      filter = { ...filter, price: priceRange }
    }

    const page = parseInt(String(req.query.page), 10) || 1
    const limit = parseInt(String(req.query.limit), 10) || 5

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: 'Page and limit must be positive numbers'
      })
    }

    const sortParsed = parseSort(typeof sortRaw === 'string' ? sortRaw : undefined)
    if (!sortParsed.ok) {
      return res.status(400).json({ message: sortParsed.message })
    }

    const skip = (page - 1) * limit

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortParsed.value)
      .populate('category', 'name')

    res.status(200).json(products)
  } catch {
    res.status(500).json({ message: 'Could not fetch products' })
  }
}

const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const product = await Product.findById(req.params.id).populate('category', 'name')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json(product)
  } catch {
    res.status(500).json({ message: 'Could not fetch product' })
  }
}

const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body
    const missingName = name === undefined || name === null || String(name).trim() === ''
    const missingPrice = price === undefined || price === null || Number.isNaN(Number(price))
    if (missingName || missingPrice) {
      return res.status(400).json({ message: 'Name and price are required' })
    }
    const newProduct = await Product.create(req.body)
    await newProduct.populate('category', 'name')
    res.status(201).json(newProduct)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: formatMongooseValidation(error) })
    }
    res.status(500).json({ message: 'Could not create product' })
  }
}

const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name')

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json(updatedProduct)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: formatMongooseValidation(error) })
    }
    res.status(500).json({ message: 'Could not update product' })
  }
}

const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product ID' })
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ message: 'Product deleted' })
  } catch {
    res.status(500).json({ message: 'Could not delete product' })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
