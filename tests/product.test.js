const Product = require("../src/models/Product");

describe("Product model validation", () => {
  it("creates a valid product with name and price", () => {
    const product = new Product({
      name: "Keyboard",
      price: 499,
      description: "Mechanical keyboard",
    });

    const error = product.validateSync();

    expect(error).toBeUndefined();
  });

  it("fails validation when name is missing", () => {
    const product = new Product({ price: 199 });

    const error = product.validateSync();

    expect(error).toBeDefined();

    expect(error.errors.name.message).toBe("Product name is required");
  });

  it("allows price to be equal to 0", () => {
    const product = new Product({ name: "Gift", price: 0 });

    const error = product.validateSync();

    expect(error).toBeUndefined();
  });

  it("fails validation when price is negative", () => {
    const product = new Product({ name: "Keyboard", price: -10 });

    const error = product.validateSync();

    expect(error).toBeDefined();

    expect(error.errors.price).toBeDefined();

    expect(error.errors.price.message).toBe(
      "Price must be equal to 0 or higher",
    );
  });

  it("fails validation when price is missing", () => {
    const product = new Product({ name: "Headphones" });

    const error = product.validateSync();

    expect(error).toBeDefined();

    expect(error.errors.price.message).toBe("Product price is required");
  });
});
