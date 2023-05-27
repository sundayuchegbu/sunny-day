const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");

const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access resources"));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});
module.exports = { isAuthenticatedUser };

module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role(${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
