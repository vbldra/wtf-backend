var express = require("express");
var router = express.Router();
<<<<<<< HEAD
const {generateValidator } = require("../middlewares/validator")
const {userValidationRules} = require("../lib/validation/userRules")
=======
const { generateValidator } = require("../middlewares/validator");
const { userValidationRules } = require("../lib/validation/userRules");
>>>>>>> upstream/main
const { authenticate } = require("../middlewares/authentication");
const {
  addUser,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  forgotPassword,
  verifyEmail,
  deleteMemory,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");

//user routes
router
  .route("/")

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
