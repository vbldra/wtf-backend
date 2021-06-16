var express = require('express');
var router = express.Router();
const { addUser, deleteUser, updateUser, loginUser } = require("../controllers/userControllers")

//user routes
router.route("/").post(addUser);
router.route("/:id").delete(deleteUser).put(updateUser);
router.route("/login").post(loginUser);

module.exports = router;
 // login, logout, relogin, middleware authentication + authorization,
 