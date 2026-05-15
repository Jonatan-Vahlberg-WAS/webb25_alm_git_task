const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../src/app')
const Product = require('../src/models/Product')
const Category = require('../src/models/Category')
const User = require('../src/models/User')

const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/product_api_test'

describe('Product API', () => {
  let category
  let product
  let productId
  let authToken

  beforeAll(async () => {
    await mongoose.connect(MONGODB_TEST_URI)
    await User.deleteMany({})
    await Category.deleteMany({})
    const reg = await request(app).post('/auth/register').send({
      email: 'product-api-tester@example.com',
      password: 'password123',
      name: 'Product API Tester'
    })
    expect(reg.status).toBe(201)
    authToken = reg.body.token

    category = await Category.create({
      name: 'electronics',
      description: 'Electronics category'
    })
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await Product.deleteMany({})
    product = await Product.create({
      name: 'Keyboard',
      price: 499,
      description: 'Mechanical keyboard',
      category: category._id
    })
    productId = product._id
  })

  const authHeader = () => ({ Authorization: `Bearer ${authToken}` })

  it('should return 401 when creating a product without auth', async () => {
    const response = await request(app).post('/products').send({
      name: 'Mouse',
      price: 199
    })
    expect(response.status).toBe(401)
  })

  it('should return all products on the first page', async () => {
    const response = await request(app).get('/products')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThanOrEqual(1)
    expect(response.body[0].name).toBe('Keyboard')
  })

  it('should filter products by name (case-insensitive partial)', async () => {
    await Product.create({ name: 'Running Shoe', price: 120, description: 'Run', category: category._id })
    const response = await request(app).get('/products?name=shoe')
    expect(response.status).toBe(200)
    const names = response.body.map((p) => p.name)
    expect(names).toContain('Running Shoe')
    expect(names).not.toContain('Keyboard')
  })

  it('should filter products by minPrice and maxPrice', async () => {
    await Product.create({ name: 'Cheap', price: 50, description: '', category: category._id })
    await Product.create({ name: 'Premium', price: 600, description: '', category: category._id })
    const minOnly = await request(app).get('/products?minPrice=100')
    expect(minOnly.status).toBe(200)
    expect(minOnly.body.every((p) => p.price >= 100)).toBe(true)

    const maxOnly = await request(app).get('/products?maxPrice=500')
    expect(maxOnly.status).toBe(200)
    expect(maxOnly.body.every((p) => p.price <= 500)).toBe(true)

    const range = await request(app).get('/products?minPrice=100&maxPrice=500')
    expect(range.status).toBe(200)
    expect(range.body.every((p) => p.price >= 100 && p.price <= 500)).toBe(true)
  })

  it('should return 400 for invalid minPrice or maxPrice', async () => {
    const badMin = await request(app).get('/products?minPrice=abc')
    expect(badMin.status).toBe(400)
    const badMax = await request(app).get('/products?maxPrice=xyz')
    expect(badMax.status).toBe(400)
  })

  it('should sort products by price ascending and descending', async () => {
    await Product.deleteMany({})
    await Product.create({ name: 'A', price: 10, description: '', category: category._id })
    await Product.create({ name: 'B', price: 30, description: '', category: category._id })
    await Product.create({ name: 'C', price: 20, description: '', category: category._id })

    const asc = await request(app).get('/products?sort=price&limit=20')
    expect(asc.status).toBe(200)
    expect(asc.body.map((p) => p.price)).toEqual([10, 20, 30])

    const desc = await request(app).get('/products?sort=-price&limit=20')
    expect(desc.status).toBe(200)
    expect(desc.body.map((p) => p.price)).toEqual([30, 20, 10])
  })

  it('should return 400 for unsupported sort field', async () => {
    const response = await request(app).get('/products?sort=createdAt')
    expect(response.status).toBe(400)
  })

  it('should create a new product with price zero when authenticated', async () => {
    await Product.deleteMany({})
    const response = await request(app).post('/products').set(authHeader()).send({
      name: 'Free sample',
      price: 0,
      description: 'Promo'
    })
    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Free sample')
    expect(response.body.price).toBe(0)
  })

  it('should create a new product', async () => {
    await Product.deleteMany({})
    const response = await request(app).post('/products').set(authHeader()).send({
      name: 'Mouse',
      price: 199,
      description: 'Wireless mouse'
    })
    expect(response.status).toBe(201)
    expect(response.body.name).toBe('Mouse')
    expect(response.body.price).toBe(199)
  })

  it('should return a 400 error if create payload is missing name', async () => {
    const response = await request(app).post('/products').set(authHeader()).send({
      price: 499,
      description: 'Mechanical keyboard'
    })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Name and price are required')
  })

  it('should return a product by id', async () => {
    const response = await request(app).get(`/products/${productId}`)
    expect(response.status).toBe(200)
    expect(response.body._id).toBe(productId.toString())
    expect(response.body.name).toBe('Keyboard')
    expect(response.body.price).toBe(499)
  })

  it('should return 400 for invalid product id on GET', async () => {
    const response = await request(app).get('/products/123')
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid product ID')
  })

  it('should return a 404 error if the product is not found', async () => {
    const missingId = new mongoose.Types.ObjectId()
    const response = await request(app).get(`/products/${missingId}`)
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Product not found')
  })

  it('should update a product by id', async () => {
    const response = await request(app).put(`/products/${productId}`).set(authHeader()).send({
      name: 'Gaming keyboard',
      price: 899,
      description: 'RGB'
    })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Gaming keyboard')
    expect(response.body.price).toBe(899)
  })

  it('should return 400 when update fails validation', async () => {
    const response = await request(app).put(`/products/${productId}`).set(authHeader()).send({
      name: '',
      price: 10,
      category: category._id
    })
    expect(response.status).toBe(400)
    expect(String(response.body.message)).toContain('Product name is required')
  })

  it('should return 404 when updating a non-existent product', async () => {
    const missingId = new mongoose.Types.ObjectId()
    const response = await request(app).put(`/products/${missingId}`).set(authHeader()).send({
      name: 'Keyboard',
      price: 499,
      description: 'Mechanical keyboard'
    })
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Product not found')
  })

  it('should delete a product by id', async () => {
    const response = await request(app).delete(`/products/${productId}`).set(authHeader())
    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Product deleted')
    const gone = await Product.findById(productId)
    expect(gone).toBeNull()
  })

  it('should return 400 for invalid product id on DELETE', async () => {
    const response = await request(app).delete('/products/not-an-object-id').set(authHeader())
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid product ID')
  })

  it('should return 404 when deleting a non-existent product', async () => {
    const missingId = new mongoose.Types.ObjectId()
    const response = await request(app).delete(`/products/${missingId}`).set(authHeader())
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Product not found')
  })
})
