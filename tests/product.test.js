const Product = require('../src/models/Product')

describe('Product model validation', () => {
  describe('required fields', () => {
    it('creates a valid product with name and price', () => {
      const product = new Product({
        name: 'Keyboard',
        price: 499,
        description: 'Mechanical keyboard'
      })
      const error = product.validateSync()

      expect(error).toBeUndefined()
    })

    it('fails validation when name is missing', () => {
      const product = new Product({ price: 199 })
      const error = product.validateSync()

      expect(error).toBeDefined()
      expect(error.errors.name.message).toBe('Product name is required')
    })
  })

  describe('price rules', () => {
    it('fails validation when price is negative', () => {
      const product = new Product({ name: 'Mouse', price: -10 })
      const error = product.validateSync()

      expect(error).toBeDefined()
      expect(error.errors.price.message).toBe('Path `price` (-10) is less than minimum allowed value (0).')
    })

    it('accepts a price of zero', () => {
      const product = new Product({ name: 'Sticker', price: 0 })
      const error = product.validateSync()
      expect(error).toBeUndefined()
    })
  })

  describe('category reference', () => {
    it('fails when category is not a valid ObjectId', () => {
      const product = new Product({
        name: 'Keyboard',
        price: 499,
        description: 'Mechanical keyboard',
        category: 'electronics'
      })
      const error = product.validateSync()

      expect(error).toBeDefined()
    })
  })
})
