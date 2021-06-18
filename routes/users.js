var express = require("express");
var router = express.Router();
const { authenticate } = require("../middlewares/authentication");
const {
  addUser,
  deleteUser,
  updateUser,
  loginUser,
} = require("../controllers/userControllers");

//user routes
router
  .route("/")
  .post(addUser)
  .delete(authenticate, deleteUser)
  .put(authenticate, updateUser);
router.route("/login").post(loginUser);

module.exports = router;
