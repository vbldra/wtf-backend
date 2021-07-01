const { getMiddlePoint } = require("../dataSources/middlePoint");
const { storeCoordinates } = require("../dataSources/database");

exports.getMiddlePoint = async (req, res, next) => {
  try {
    const { geoMiddle, geoPeopleAddresses, geoBoundsAddresses } =
      await getMiddlePoint(req.body);
    req.coordinates = geoPeopleAddresses;
    res.on("finish", () => {
      storeCoordinates(geoPeopleAddresses);
    });
    res.json({
      middlePoint: geoMiddle,
      peopleAddresses: geoPeopleAddresses,
      boundsAddresses: geoBoundsAddresses,
    });
  } catch (err) {
    res.status(500);
  }
};
