const {
  getMiddlePoint,
  getHotels,
  getRestaurants,
  getClosestCity,
} = require("../dataSources/apiLocationData");
const { getBounds } = require("geolib");
const { storeCoordinates } = require("../dataSources/database");
exports.getLocationData = async (req, res) => {
  try {
    const { midLocation, geoPeopleAddresses, geoBoundsAddresses } =
      await getMiddlePoint(req.body);
    req.coordinates = geoPeopleAddresses;
    res.on("finish", () => {
      storeCoordinates(geoPeopleAddresses);
    });
    const hotelsData = await getHotels(midLocation);
    const restaurantsData = await getRestaurants(midLocation);
    const closestCityData = await getClosestCity(midLocation);
    const filteredData = [...hotelsData, ...restaurantsData];
    const filteredBoundedData = filteredData.length ? getBounds(filteredData) : {}
    // console.log("CLOSEST CITY",closestCityData)
    res.json({
      middlePoint: midLocation,
      peopleAddresses: geoPeopleAddresses,
      boundsAddresses: geoBoundsAddresses,
      hotelsAddresses: hotelsData,
      restaurantsAddresses: restaurantsData,
      boundsFiltered: filteredBoundedData,
      closestCity: closestCityData,
    });
  } catch (err) {
    console.error(err); // !!!
    res.status(500);
  }
};
exports.getRestaurantsInformation = async (req, res) => {
  try {
    const restaurantsData = await getRestaurants(req.body);
    res.json(restaurantsData);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
