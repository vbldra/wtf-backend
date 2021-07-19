const {
  getMiddlePoint,
  getHotels,
  getRestaurants,
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

    const filteredData = [...hotelsData, ... restaurantsData];
    const filteredBoundedData = getBounds(filteredData);
    
    res.json({
      middlePoint: midLocation,
      peopleAddresses: geoPeopleAddresses,
      boundsAddresses: geoBoundsAddresses,
      hotelsAddresses: hotelsData,
      restaurantsAddresses: restaurantsData,
      boundsFiletered: filteredBoundedData,
    });
  } catch (err) {
    res.status(500);
  }
};

// exports.getClosestCity = async (req, res) => {
//   try {
//     const locationData = await getClosestCity(req.body);
//     res.json(locationData);
//   } catch (err) {
//     res.status(500);
//   }
// };

exports.getHotelsInformation = async (req, res) => {
  try {
    const hotelsData = await getHotels(req.body);
    res.json(hotelsData);
  } catch (err) {
    res.status(500);
  }
};

exports.getRestaurantsInformation = async (req, res) => {
  try {
    const restaurantsData = await getRestaurants(req.body);
    res.json(restaurantsData);
  } catch (err) {
    res.status(500);
  }
};
