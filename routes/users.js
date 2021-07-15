var express = require("express");
var router = express.Router();
const {generateValidator } = require("../middlewares/validator")
const {userValidationRules} = require("../lib/validation/userRules")
const { authenticate } = require("../middlewares/authentication");
const {
  addUser,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  uploadMemory,
  forgotPassword,
  verifyEmail,
} = require("../controllers/userControllers");

//user routes
router
  .route("/")
  
  .get(authenticate, getUser)
  .post(addUser)
  .delete(authenticate, deleteUser)
  .put(authenticate, updateUser);
  
router.route("/login").post(loginUser);

router.route("/uploadMemory").post(authenticate, uploadMemory);
router.route("/forgotPassword").post(forgotPassword)
router.get("/verify/:emailToken", verifyEmail);
module.exports = router;
