const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/register").post(authCtrl.registerUser);

router.route("/login").post(authCtrl.loginUser);

router.route("/logout").get(authCtrl.logoutUser);

router.route("/password/forgot").post(authCtrl.forgotPassword);

router.route("/password/reset/:token").put(authCtrl.resetPassword);

router.route("/me/update").put(isAuthenticatedUser, authCtrl.updateProfile);

router.route("/me").get(isAuthenticatedUser, authCtrl.getUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), authCtrl.allUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), authCtrl.getUserDetails);

router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), authCtrl.updateUser);
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), authCtrl.deleteUser);

router
  .route("/password/update")
  .put(isAuthenticatedUser, authCtrl.updatePassword);

module.exports = router;
