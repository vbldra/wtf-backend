const { getMiddlePoint } = require("../dataSources/middlePoint");
const { storeCoordinates } = require("../middlewares/storeCoordinates");
exports.getMiddlePoint = async (req, res, next) => {
  try {
    const { geoMiddle, geoPeopleAddresses } = await getMiddlePoint(req.body);
    req.coordinates = geoPeopleAddresses;
    res.on("finish", () => {
      storeCoordinates(geoPeopleAddresses);
    });
    res.json(geoMiddle);
  } catch (err) {
    res.status(500);
  }
};
