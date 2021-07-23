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
      const dbLocation = await Address.findOne({
        location: address.toLowerCase(),
      });
      if (dbLocation) {
        geoPeopleAddresses.push({
          ...dbLocation.toObject(),
          address: address.toLowerCase(),
        });
      } else {
        // converting all the input fields to co-ordinates
        try {
          const parameters = {
            apiKey: keyAPI,
            q: address,
          };
          const geoPosition = await axios(
            `https://geocode.search.hereapi.com/v1/geocode`,
            { params: parameters }
          );
          let lat = geoPosition.data.items[0].position.lat;
          let lng = geoPosition.data.items[0].position.lng;
          try {
            await Address.create({
              location: address,
              longitude: lng,
              latitude: lat,
            });
          } catch (error) {
            console.log(error);
          }
          geoPeopleAddresses.push({
            latitude: lat,
            longitude: lng,
            address: address,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    return geoPeopleAddresses;
  } catch (error) {
    console.error(error);
  }
};

const getClosestCity = async (geoLocation) => {
  const parameters = {
    apiKey: keyAPI,
    pos: `${geoLocation.latitude},${geoLocation.longitude},0`,
    mode: "retrieveAll",
    prox: `${geoLocation.latitude},${geoLocation.longitude},100000`,
  };
  const middleAddress = await axios.get(
    `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json`,
    { params: parameters }
  );
  if (middleAddress.data.Response.View.length) {
    // console.log(middleAddress.data.Response.View[0].Result[0].Location.Address)
    const city =
      middleAddress.data.Response.View[0].Result[0].Location.Address.Label;
    const cityToSend = city.replace(/\s/g, "").split(",").join("+");
    const parametersCity = {
      q: cityToSend,
      apiKey: keyAPI,
    };
    const cityCoordinates = await axios(
      `https://geocode.search.hereapi.com/v1/geocode`,
      { params: parametersCity }
    );
    let lat = cityCoordinates.data.items[0].position.lat;
    let lng = cityCoordinates.data.items[0].position.lng;
    let cityObject = { latitude: lat, longitude: lng, address: city };
    // console.log("this", cityObject)
    return cityObject;
  } else {
    console.log("NO CITIES AROUND")
    return {error: "Your middle point is in unpopulated area"}
  }
};

exports.getMiddlePoint = async (peopleAddresses) => {
  // console.log({ peopleAddresses });
  const geoPeopleAddressesFullArray = await getCoordinates(peopleAddresses);
  const geoPeopleAddresses = geoPeopleAddressesFullArray.map((element) => {
    return {
      latitude: Number(element.latitude),
      longitude: Number(element.longitude),
      address: element.address,
    };
  });
  // console.log(geoPeopleAddresses);
  // geolib function to find center of all the points
  const geoMiddle = getCenterOfBounds(geoPeopleAddresses);
  const address = await getClosestCity(geoMiddle);
  const midLocation = {
    latitude: geoMiddle.latitude,
    longitude: geoMiddle.longitude,
    address: address,
  };
  // geolib function to find min and max of the bounds of coordinates
  const geoBoundsAddresses = getBounds(geoPeopleAddresses);
  return {
    midLocation,
    geoPeopleAddresses,
    geoBoundsAddresses,
  };
};
exports.getHotels = async (geoLocation) => {
  let hotelsList = [];
  const parameters = {
    apiKey: keyAPI,
    in: `circle:${geoLocation.latitude},${geoLocation.longitude};r=100000`,
    q: "hotels",
  };
  const hotels = await axios.get(
    `https://discover.search.hereapi.com/v1/discover`,
    { params: parameters }
  );
  for (let index = 0; index < hotels.data.items.length; index++) {
    let hotel = {
      latitude: hotels.data.items[index].position.lat,
      longitude: hotels.data.items[index].position.lng,
      address: hotels.data.items[index].address.label,
    };
    hotelsList.push(hotel);
  }
  const hotelsData = hotelsList;
  return hotelsData;
};
exports.getRestaurants = async (geoLocation) => {
  let restaurantsList = [];
  const parameters = {
    apiKey: keyAPI,
    in: `circle:${geoLocation.latitude},${geoLocation.longitude};r=100000`,
    q: `restaurants`
  };
  const restaurants = await axios.get(
    `https://discover.search.hereapi.com/v1/discover`,
    { params: parameters }
  );
  for (let index = 0; index < restaurants.data.items.length; index++) {
    let restaurant = {
      latitude: restaurants.data.items[index].position.lat,
      longitude: restaurants.data.items[index].position.lng,
      address: restaurants.data.items[index].address.label,
    };
    restaurantsList.push(restaurant);
  }
  const restaurantsData = restaurantsList;
  return restaurantsData;
};
exports.getClosestCity = getClosestCity;
