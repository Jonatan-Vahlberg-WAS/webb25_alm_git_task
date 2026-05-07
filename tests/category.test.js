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
