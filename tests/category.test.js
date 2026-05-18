const Category = require('../src/models/Category')

describe('Category model validation', () => {
    it('create a valid product with name, description and if active', () => {
        const category = new Category({
            name: 'electronics',
            description: 'Keyboards', 
            isActive: false
        })
        const error = category.validateSync()

        expect(error).toBeUndefined()
    })

    it('fails validation when name is invalid', () => {
        const category = new Category({ name: 'food' })
        const error = category.validateSync()

        expect(error).toBeDefined()
        expect(error.errors.name.message).toBe('food is not a supported category')
    })
    
    it('Validate name required', () => {
        const category = new Category({ 
            description: 'electronics',
            isActive: true
        })
        const error = category.validateSync()
        
        expect(error).toBeDefined()
        expect(error.errors.name.message).toBe('Category name is required')
    })
})

