const { Router } = require("express");
const router = Router();
const getData = require("../controllers/apiRequestController");
router.post("/", getData);
module.exports = router;
