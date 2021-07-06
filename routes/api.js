const { Router } = require("express");
const router = Router();
const {
  getLocationData,
  getClosestCity,
} = require("../controllers/apiRequestController");

router.post("/", getLocationData);
//router.post("/city", getClosestCity);
module.exports = router;
