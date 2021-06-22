var getCordinates = require("../dataSources/middlePoint");
const getData = async (req, res) => {
  try {
    const cordinates = await getCordinates(req.body);
    res.json(cordinates);
  } catch (err) {
    res.status(500);
  }
};
module.exports = getData;
