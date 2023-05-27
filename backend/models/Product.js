const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [String, "Please enter product name"],
      trim: true,
      maxlength: [100, "Product cannot excced more than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0.0,
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please select category for this product"],
      enum: {
        values: [
          "Electronics",
          "Laptops",
          "Cameras",
          "Accessorries",
          "Headphones",
          "Food",
          "Books",
          "Cloths/Shoes",
          "Beauty/Health",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please select correct category for product",
      },
    },
    seller: {
      type: String,
      required: [true, "Please enter product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxlength: [5, "Product stock  cannoot exceed 5 characters"],
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Product = model("Product", productSchema);
module.exports = Product;
