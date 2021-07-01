const Address = require("../models/Address");
const axios = require("axios");
const { getCenterOfBounds } = require("geolib");
const keyAPI = process.env.API_KEY;
// array for co-ordinates

const getCoordinates = async (peopleAddresses) => {
  const geoPeopleAddresses = [];
  try {
    for (const person in peopleAddresses) {
      if (peopleAddresses[person]) {
        const dbLocation = await Address.findOne({
          location: peopleAddresses[person],
        });

        if (dbLocation) {
          geoPeopleAddresses.push({
            ...dbLocation.toObject(),
            address: peopleAddresses[person],
          });
        } else {
          // parsing all the input fields to co-ordinates
          console.log("request coords from api");
          const geoPosition = await axios(
            `https://geocode.search.hereapi.com/v1/geocode?q=${peopleAddresses[person]}&apiKey=${keyAPI}`
          );
          let lat = geoPosition.data.items[0].position.lat;
          let lng = geoPosition.data.items[0].position.lng;
          geoPeopleAddresses.push({
            latitude: lat,
            longitude: lng,
            address: peopleAddresses[person],
          });
        }
      }
    }
    return geoPeopleAddresses;
  } catch (error) {
    throw new Error(error);
  }
};
exports.getMiddlePoint = async (peopleAddresses) => {
  const geoPeopleAddresses = await getCoordinates(peopleAddresses);
  const geoMiddle = getCenterOfBounds(geoPeopleAddresses);
  console.log("geoMiddle", geoMiddle);
  console.log("geoPeopleAddresses", geoPeopleAddresses);
  return { geoMiddle, geoPeopleAddresses };
};
