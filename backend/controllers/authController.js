const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

const authCtrl = {
  registerUser: asyncHandler(async (req, res, next) => {
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    sendToken(user, 200, res);
  }),
  loginUser: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    //  Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    sendToken(user, 200, res);
  }),
  updateProfile: asyncHandler(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    // Update avata
    if (req.body.avatar !== "") {
      const user = await User.findById(req.user.id);

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

      newUserData.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  }),
  updatePassword: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    //  check previous user password
    const isMatch = await user.comparePassword(req.body.oldPassword);
    if (!isMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
  }),
  logoutUser: asyncHandler(async (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  }),
  forgotPassword: asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create reset password url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Deluxe-shop Password Recovery",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500));
    }
  }),
  resetPassword: asyncHandler(async (req, res, next) => {
    // Hash the URL token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(
        new ErrorHandler("Password reset token is invalid or has expired", 400)
      );
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not match", 400));
    }
    // Setup new Password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  }),
  getUserProfile: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  }),
  allUsers: asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  }),
  getUserDetails: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User not found with the the id: ${req.params.id}`)
      );
    }
    res.status(200).json({
      success: true,
      user,
    });
  }),
  updateUser: asyncHandler(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
    });
  }),
  deleteUser: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler(`User not found with the the id: ${req.params.id}`)
      );
    }

    // Remove avatar from cloudinary -TODO

    await user.remove();

    res.status(200).json({
      success: true,
    });
  }),
};

module.exports = authCtrl;
