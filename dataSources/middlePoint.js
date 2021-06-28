const { default: axios } = require("axios");

const { getCenterOfBounds } = require("geolib");
require("dotenv").config();
const keyAPI = process.env.API_KEY;

const getCoordinates = async (peopleAddresses) => {
  const geoPeopleAddresses = []; // array for co-ordinates
  try {
    for (const person in peopleAddresses) {
      if (peopleAddresses[person]) {
        // parsing all the input fields to co-ordinates
        const geoPosition = await axios(
          `https://geocode.search.hereapi.com/v1/geocode?q=${peopleAddresses[person]}&apiKey=${keyAPI}`
        );
        let lat = geoPosition.data.items[0].position.lat;
        let lng = geoPosition.data.items[0].position.lng;
        geoPeopleAddresses.push({ latitude: lat, longitude: lng });

        // geolib function to find center of all the points
        // converting back co-ordinates to the address
      }
    }
    console.log({ geoPeopleAddresses });
    const geoMiddle = getCenterOfBounds(geoPeopleAddresses);

    console.log(geoMiddle);
    return geoMiddle;
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = getCoordinates;
