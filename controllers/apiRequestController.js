const { getMiddlePoint } = require("../dataSources/middlePoint");
const { storeCoordinates } = require("../dataSources/database");
exports.getMiddlePoint = async (req, res, next) => {
  try {
    const { geoMiddle, geoPeopleAddresses } = await getMiddlePoint(req.body);
    req.coordinates = geoPeopleAddresses;
    res.on("finish", () => {
      storeCoordinates(geoPeopleAddresses);
    });
    res.json({ geoMiddle: geoMiddle, geoPeopleAddresses: geoPeopleAddresses });
  } catch (err) {
    res.status(500);
  }
};
