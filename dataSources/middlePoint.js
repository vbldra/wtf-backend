const axios = require("axios");
const { getCenterOfBounds, getBounds } = require("geolib");
require("dotenv").config();
const Address = require("../models/Address");

const keyAPI = process.env.API_KEY;

const getCoordinates = async (peopleAddresses) => {
  const geoPeopleAddresses = []; // array for co-ordinates
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
          console.log("request coords from api");
          // converting all the input fields to co-ordinates
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

        // converting back co-ordinates to the address
        //const geoMiddle = getCenter(geoPeopleAddresses);
        // const middleAddress = await axios.get(
        //   `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${keyAPI}&pos=${geoMiddle.latitude},${geoMiddle.longitude},0&mode=retrieveAll&prox=${geoMiddle.latitude},${geoMiddle.longitude},5`
        // );
        // console.log(middleAddress.data.Response.View[0].Result[0].Location);
        //return middleAddress.data.Response.View[0].Result[0].Location
        //.DisplayPosition;
        //return middleAddress.data.Response.View[0].Result[0].Location; // Saving the label (city, country and so on)
      }
    }
    return geoPeopleAddresses;
  } catch (error) {
    throw new Error(error);
  }
};
exports.getMiddlePoint = async (peopleAddresses) => {
  const geoPeopleAddresses = await getCoordinates(peopleAddresses);
  // geolib function to find center of all the points
  const geoMiddle = getCenterOfBounds(geoPeopleAddresses);
  // geolib function to find min and max of the bounds of coordinates
  const geoBoundsAddresses = getBounds(geoPeopleAddresses);

  //   const sharingData = [
  //     {
  //       middlePoint: geoMiddle,
  //       peopleAddresses: geoPeopleAddresses,
  //       boundsAddresses: geoBoundsAddresses,
  //     },
  //   ];
  // console.log("geo", sharingData);
  //   return sharingData;

  //   console.log("geoPeopleAddresses", geoPeopleAddresses);
  return { geoMiddle, geoPeopleAddresses, geoBoundsAddresses };
};
