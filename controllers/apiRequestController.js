var getCordinates = require("../dataSources/middlePoint");
const getData = async (req, res) => {
  const cordinates = await getCordinates(req.body);
  res.json(cordinates);
};
module.exports = getData;
