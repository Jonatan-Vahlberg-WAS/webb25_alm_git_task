const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await Product.find();
    if (name && name.trim() !== "") {
      products = products.filter((p) =>
        p.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
      );
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not fetch products", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not fetch product", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Could not create product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Could not update product", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Could not delete product", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
