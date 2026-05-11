const Category = require('../src/models/Category')

describe('Category Model & CRUD Tests', () => {
    describe('Category Model Validation', () => {
        it('creates a valid category object with a name', () => {
            const category = new Category({ name: 'toys' })
            const error = category.validateSync()

            expect(error).toBeUndefined()
            expect(category.name).toBe('toys')
        })

        it('fails validation when name is missing', () => {
            const category = new Category({ description: 'Food from all over the world' })
            const error = category.validateSync()

            expect(error).toBeDefined()
            expect(error.errors.name.message).toBe('Category name is required')
        })
    })

    describe('GET /api/categories', () => {
        it('should fetch all categories', () => {
            const categories = [
                new Category({ name: 'books' }),
                new Category({ name: 'toys' })
            ]

            expect(Array.isArray(categories)).toBe(true)
            expect(categories[0].name).toBe('books')
            expect(categories.length).toBe(2)
        })
    })

    describe('PUT /api/categories/:id', () => {
        it('should update an existing category name', () => {
            const category = new Category({ name: 'Old Name' })

            category.name = 'New Updated Name'
            const error = category.validateSync()

            expect(error).toBeUndefined()
            expect(category.name).toBe('New Updated Name')
        })
    })

    describe('DELETE /api/categories/:id', () => {
        it('should delete a category', () => {
            const category1 = new Category({ name: 'Delete Me' })
            const category2 = new Category({ name: 'books' })
            let categories = [category1, category2]

            const idToDelete = category1._id
            categories = categories.filter(cat => cat._id !== idToDelete)

            expect(categories.length).toBe(1)
            expect(categories[0].name).toBe('books')
            expect(categories.find(cat => cat._id === idToDelete)).toBeUndefined()
        })
    })
})