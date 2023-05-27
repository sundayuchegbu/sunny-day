// const dotenv = require("dotenv");
const express = require("express");
const app = express();
const products = require("./routes/product");
const bodyParser = require("body-parser");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const order = require("./routes/order");
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");
const path = require("path");

const errorMiddleware = require("./middleware/errors");

// dotenv.config({ path: "backend/config/config.env" });

if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });

app.use(express.json({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(fileUpload());

app.use("/api/v1/", products);

app.use("/api/v1", auth);

app.use("/api/v1", payment);

app.use("/api/v1", order);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(errorMiddleware);

module.exports = app;
