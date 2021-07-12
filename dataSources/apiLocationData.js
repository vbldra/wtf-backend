const axios = require("axios");
const { getCenterOfBounds, getBounds } = require("geolib");
const Address = require("../models/Address");

require("dotenv").config();

const keyAPI = process.env.API_KEY;
const openSourceAPIKEY = process.env.OPEN_SOURCE_API_KEY;

function delay(time = 20) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const getCoordinates = async (peopleAddresses) => {
  const geoPeopleAddresses = [];

  try {
    for (const address of peopleAddresses) {
      await delay();
      const dbLocation = await Address.findOne({
        location: address,
      });
      if (dbLocation) {
        geoPeopleAddresses.push({
          ...dbLocation.toObject(),
          address: address,
        });
      } else {
        console.log("request coords from api");
        // converting all the input fields to co-ordinates
        const geoPosition = await axios(
          `https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${keyAPI}`
        );
        let lat = geoPosition.data.items[0].position.lat;
        let lng = geoPosition.data.items[0].position.lng;

        geoPeopleAddresses.push({
          latitude: lat,
          longitude: lng,
          address: address,
        });
      }
    }
    console.log(geoPeopleAddresses);
    return geoPeopleAddresses;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMiddlePoint = async (peopleAddresses) => {
  console.log({ peopleAddresses });
  const geoPeopleAddressesFullArray = await getCoordinates(peopleAddresses);
  const geoPeopleAddresses = geoPeopleAddressesFullArray.map((element) => {
    return {
      latitude: Number(element.latitude),
      longitude: Number(element.longitude),
    };
  });
  console.log(geoPeopleAddresses);
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

exports.getClosestCity = async (geoLocation) => {
  const parameters = {
    apiKey: keyAPI,
    pos: `${geoLocation.latitude},${geoLocation.longitude},0`,
    mode: "retrieveAreas",
    prox: `${geoLocation.latitude},${geoLocation.longitude},1000`,
  };
  const middleAddress = await axios.get(
    `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json`,
    { params: parameters }
  );
  console.log(
    "details",
    middleAddress.data.Response.View[0].Result[0].Location.Address.Label
  );
  const city =
    middleAddress.data.Response.View[0].Result[0].Location.Address.Label;
  return city;
};

exports.getHotels = async (geoLocation) => {
  const parameters = {
    apiKey: keyAPI,
    pos: `${geoLocation.latitude},${geoLocation.longitude},270`,
    mode: "retrieveLandmarks",
    prox: `${geoLocation.latitude},${geoLocation.longitude},100`,
  };
  const hotels = await axios.get(
    `https://discover.search.hereapi.com/v1/discover?in=circle:${geoLocation.latitude},${geoLocation.longitude};r=5000&q=hotels&apiKey=${keyAPI}`
  );
  console.log("details", hotels.data.items);
  const hotelsData = hotels.data.items;
  return hotelsData;
};

exports.getRestaurants = async (geoLocation) => {
  const parameters = {
    apiKey: keyAPI,
    pos: `${geoLocation.latitude},${geoLocation.longitude},270`,
    mode: "retrieveLandmarks",
    prox: `${geoLocation.latitude},${geoLocation.longitude},100`,
  };
  const restaurants = await axios.get(
    `https://discover.search.hereapi.com/v1/discover?in=circle:${geoLocation.latitude},${geoLocation.longitude};r=5000&q=restaurants&apiKey=${keyAPI}`
  );
  console.log("details", restaurants.data.items);
  const restaurantsData = restaurants.data.items;
  return restaurantsData;
};
