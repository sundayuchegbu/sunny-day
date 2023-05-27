const express = require("express");
const router = express.Router();
const orderCtrl = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser, orderCtrl.newOrder);

router.route("/order/:id").get(isAuthenticatedUser, orderCtrl.getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser, orderCtrl.myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), orderCtrl.allOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), orderCtrl.updateOrders);
router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), orderCtrl.deleteOrder);

module.exports = router;
