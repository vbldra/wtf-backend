const { Router } = require("express");
const router = Router();
const {
  getLocationData,
  getClosestCity,
  getHotelsInformation,
  getRestaurantsInformation,
} = require("../controllers/apiRequestController");

router.post("/", getLocationData);
router.post("/city", getClosestCity);
router.post("/hotels", getHotelsInformation);
router.post("/restaurants", getRestaurantsInformation);
module.exports = router;
