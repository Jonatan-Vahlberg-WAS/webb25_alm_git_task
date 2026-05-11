const express = require('express');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Product API is running' });
});

module.exports = app;
