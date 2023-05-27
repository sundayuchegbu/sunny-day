const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const paymentCtrl = {
  // process stripe paymemts => /api/v1/payment/process

  processPayment: asyncHandler(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "ngn",

      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  }),

  // process stripe API key => /api/v1/stripeapi

  sendStripeApi: asyncHandler(async (req, res, next) => {
    res.status(200).json({
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  }),
};
module.exports = paymentCtrl;
