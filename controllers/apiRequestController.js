const {
  getMiddlePoint,
  //getClosestCity,
} = require("../dataSources/apiLocationData");

const { storeCoordinates } = require("../dataSources/database");

exports.getLocationData = async (req, res) => {
  try {
    const { midLocation, geoPeopleAddresses, geoBoundsAddresses } =
      await getMiddlePoint(req.body);
    req.coordinates = geoPeopleAddresses;
    res.on("finish", () => {
      storeCoordinates(geoPeopleAddresses);
    });
    res.json({
      middlePoint: midLocation,
      peopleAddresses: geoPeopleAddresses,
      boundsAddresses: geoBoundsAddresses,
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
