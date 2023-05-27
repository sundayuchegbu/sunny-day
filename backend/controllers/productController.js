const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

const ProductCtrl = {
  newProduct: asyncHandler(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      product,
    });
  }),

  getProducts: asyncHandler(async (req, res, next) => {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFeatures.query;
    let filterProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query.clone();

    res.status(200).json({
      success: true,
      productsCount,
      filterProductsCount,
      resPerPage,
      products,
    });
  }),

  // Get All Product (admin)
  getAdminProducts: asyncHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  }),

  getSingleProduct: asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }),
  updateProduct: asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
      }

      let imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }),
  deleteProduct: asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    // Deleting images associated with product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }
    await product.remove();

    res.status(200).json({
      success: true,
      message: "Product is deleted",
    });
  }),
  createProductReview: asyncHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user._id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }),
  getProductReview: asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  }),
  deleteReview: asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  }),
};
module.exports = ProductCtrl;
