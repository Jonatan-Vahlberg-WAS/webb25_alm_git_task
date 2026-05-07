const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = require("./app");
const productRoutes = require("./routes/productRoutes");

dotenv.config();

app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/product_api";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      // Intentionally vague startup message for teaching.
      console.log("Server running");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
