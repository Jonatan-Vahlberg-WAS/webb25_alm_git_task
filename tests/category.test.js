const Category = require('../src/models/Category')

describe('Category model validation', () => {
  it('creates a valid category with name', () => {
    const category = new Category({
      name: 'toys'
    })
    const error = category.validateSync()

    expect(error).toBeUndefined()
  })

  it('fails validation when name is missing', () => {
    const category = new Category({ description: 'Food from all over the world' })
    const error = category.validateSync()

    expect(error).toBeDefined()
    expect(error.errors.name.message).toBe('Category name is required')
  })
})

describe('GET /api/categories', () => {
  it('should fetch all categories', async () => {
    await Category.create({ name: 'books' })

    const res = await request(app).get('/api/categories')

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})

describe('PUT /api/categories/:id', () => {
  it('should update an existing category name', async () => {
    const category = await Category.create({ name: 'Old Name' })

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .send({ name: 'New Updated Name' })

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Updated Name')
  })
})

describe('DELETE /api/categories/:id', () => {
  it('should delete a category and return 200', async () => {
    const category = await Category.create({ name: 'Delete Me' })

    const res = await request(app).delete(`/api/categories/${category._id}`)

    expect(res.statusCode).toBe(200)
    
    const deletedCategory = await Category.findById(category._id)
    expect(deletedCategory).toBeNull()
  })
})