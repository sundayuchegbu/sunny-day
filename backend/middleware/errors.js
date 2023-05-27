const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    // wrong mongoose object error ID error
    if (err.name === "castError") {
      const message = `Resources not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    //  Handling Mongoose validation Error
    if (err.message === "validationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose  duplicate key errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyvalue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (err.message === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }
    // Handling Expire JWT error
    if (err.message === "TokenExpiredError") {
      const message = "JSON Web Token is expired. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: error.message || "Internal server Error",
    });
  }
};
