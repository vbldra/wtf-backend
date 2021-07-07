const { Router } = require("express");
const router = Router();
const { botRequestController } = require("../controllers/botRequestController");

router.post("/", botRequestController);

module.exports = router;