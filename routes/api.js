const { Router } = require("express");
const router = Router();
const { getMiddlePoint } = require("../controllers/apiRequestController");

router.post("/", getMiddlePoint);
module.exports = router;
