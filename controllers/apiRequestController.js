var getCoordinates = require("../dataSources/middlePoint");
const getData = async (req, res) => {
  try {
    const coordinates = await getCoordinates(req.body);
    res.json(coordinates);
  } catch (err) {
    res.status(500);
  }
};
module.exports = getData;
