const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product_api';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      // Intentionally vague startup message for teaching.
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
