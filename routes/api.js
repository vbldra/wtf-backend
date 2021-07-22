const { Router } = require("express");
const router = Router();
const {
  getLocationData,
  getHotelsInformation,
  getRestaurantsInformation,
} = require("../controllers/apiRequestController");

router.post("/", getLocationData);
// router.post("/hotels", getHotelsInformation);
// router.post("/restaurants", getRestaurantsInformation);
module.exports = router;
