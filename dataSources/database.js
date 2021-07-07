const Address = require("../models/Address");

exports.storeCoordinates = async (coordinates) => {
  await Address.bulkWrite(
    coordinates.map((item) => ({
      updateOne: {
        filter: { location: item.address },
        update: { ...item, location: item.address },
        upsert: true,
      },
    }))
  );
};
