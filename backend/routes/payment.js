const express = require("express");
const router = express.Router();
const paymentCtrl = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middleware/auth");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

router
  .route("/payment/process")
  .post(isAuthenticatedUser, paymentCtrl.processPayment);

router.route("/stripeapi").get(isAuthenticatedUser, paymentCtrl.sendStripeApi);

module.exports = router;
