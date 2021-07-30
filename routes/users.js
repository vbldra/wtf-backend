var express = require("express");
var router = express.Router();
const { generateValidator } = require("../middlewares/validator");
const { userValidationRules } = require("../lib/validation/userRules");
const { authenticate } = require("../middlewares/authentication");
const {
  addUser,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  deleteMemory,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");

//user routes
router
  .route("/")
  .put(authenticate, updateUser)
  .get(authenticate, getUser)
  .post(addUser)
  .delete(authenticate, deleteUser);
router.post("/forgotpassword", forgotPassword);

router.route("/login").post(loginUser);
router.route("/memory").delete(deleteMemory);
// router.route("/forgotPassword").post(forgotPassword)
router.get("/verify/:emailToken", verifyEmail);
router.put("/resetPassword", resetPassword);
module.exports = router;
