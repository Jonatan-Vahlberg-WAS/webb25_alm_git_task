const Category = require('../src/models/Category')

describe('Category model validation', () => {
  it('creates a valid category with name', () => {
    const category = new Category({
      name: 'toys'
    })
    const error = category.validateSync()

    expect(error).toBeUndefined()
  })
})
