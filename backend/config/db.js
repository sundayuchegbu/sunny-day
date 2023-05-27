const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Mongodb connected successfully");
    })
    .catch((err) => {
      console.error(err.message);
    });
};
module.exports = connectDB;
