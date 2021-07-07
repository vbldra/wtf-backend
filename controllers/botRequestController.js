const { getCenterOfBounds } = require("geolib");

exports.botRequestController = async (req, res, next) => {
  try {
    const data = await req.body
    const geoMiddle = getCenterOfBounds(data);
    res.json({
      coordinates: geoMiddle,
    });
  } catch (err) {
    res.status(500);
  }
};