const Product = require('../src/models/Product');

describe('Product model validation', () => {
  it('creates a valid product with name and price', () => {
    const product = new Product({ name: 'Keyboard', price: 499, description: 'Mechanical keyboard' });
    const error = product.validateSync();

    expect(error).toBeUndefined();
  });

  it('fails validation when name is missing', () => {
    const product = new Product({ price: 199 });
    const error = product.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.name.message).toBe('Product name is required');
  });

  it('allows negative prices because no minimum validation exists)', () => {
    const product = new Product({ name: 'Mouse', price: -10 });
    const error = product.validateSync();

    // This is intentionally incorrect because no min price validation is defined.
    expect(error).toBeUndefined();
  });
});
