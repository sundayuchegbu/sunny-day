const Product = require("../models/Product");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const products = require("../data/products.json");

// Setting Dotenv file

dotenv.config({ path: "backend/config/config.env" });

connectDB();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted");

    await Product.insertMany(products);
    console.log("All products are add");

    process.exit(1);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
seedProducts();
