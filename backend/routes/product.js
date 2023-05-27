const express = require("express");
const router = express.Router();
const ProductCtrl = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/products").get(ProductCtrl.getProducts);

router.route("/admin/products").get(ProductCtrl.getAdminProducts);

router.route("/product/:id").get(ProductCtrl.getSingleProduct);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), ProductCtrl.newProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), ProductCtrl.updateProduct)
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    ProductCtrl.deleteProduct
  );

router
  .route("/review")
  .put(isAuthenticatedUser, ProductCtrl.createProductReview);

router.route("/reviews").get(isAuthenticatedUser, ProductCtrl.getProductReview);

router.route("/reviews").delete(isAuthenticatedUser, ProductCtrl.deleteReview);

module.exports = router;
