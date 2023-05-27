const app = require("./app");
// const dotenv = require("dotenv");
const connectDB = require("./config/db");

const cloudinary = require("cloudinary");

// uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/config.env" });

// dotenv.config({ path: "backend/config/config.env" });

connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down due to  server Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
