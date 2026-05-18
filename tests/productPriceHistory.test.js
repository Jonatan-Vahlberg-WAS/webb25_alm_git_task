const mongoose = require('mongoose')
const ProductPriceHistory = require('../src/models/ProductPriceHistory')
const Product = require('../src/models/Product')
const Category = require('../src/models/Category')
const { connectDb, disconnectDb } = require('./helpers/db')

describe('ProductPriceHistory', () => {
  beforeAll(async () => {
    await connectDb()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  beforeEach(async () => {
    await ProductPriceHistory.deleteMany({})
    await Product.deleteMany({})
    await Category.deleteMany({})
  })

  describe('model validation', () => {
    it('requires product and price', () => {
      const missingProduct = new ProductPriceHistory({ price: 10 })
      expect(missingProduct.validateSync().errors.product).toBeDefined()

      const missingPrice = new ProductPriceHistory({ product: new mongoose.Types.ObjectId() })
      expect(missingPrice.validateSync().errors.price).toBeDefined()
    })

    it('defaults date when omitted', () => {
      const entry = new ProductPriceHistory({
        product: new mongoose.Types.ObjectId(),
        price: 99
      })
      const err = entry.validateSync()
      expect(err).toBeUndefined()
      expect(entry.date).toBeInstanceOf(Date)
    })
  })

  describe('integration with Product', () => {
    it('creates history linked to an existing product when price is set', async () => {
      const category = await Category.create({ name: 'home', description: 'Home' })
      const product = await Product.create({
        name: 'Lamp',
        price: 40,
        description: 'Desk lamp',
        category: category._id
      })
      const rows = await ProductPriceHistory.find({ product: product._id })
      expect(rows.length).toBeGreaterThanOrEqual(1)
      expect(rows[0].price).toBe(40)
    })
  })
})
