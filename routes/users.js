var express = require("express");
var router = express.Router();
const { authenticate } = require("../middlewares/authentication");
const {
  addUser,
  getUser,
  deleteUser,
  updateUser,
  loginUser,
  uploadMemory,
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

module.exports = router;
