const Category = require('../src/models/Category')

describe ('Category model validation', () => {
    it('create a valid product with name, description and if active', () => {
        const category = new Category({
            name: 'Keyboard',
            description: 'Keyboards', 
            isActive: false
        })
        const error = category.validateSync()

        expect(error).toBeUndefined()
    })
    
    it('Validate name required', () => {
        const category = new Category({ 
            description: 'Mouses',
            isActive: true
        })
        const error = category.validateSync()
        
        expect(error).toBeDefined()
        expect(error.errors.name.message).toBe('Category name is required')
    })
})

