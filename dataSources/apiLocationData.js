const axios = require("axios");
const { getCenterOfBounds, getBounds } = require("geolib");
const { Gone } = require("http-errors");
const Address = require("../models/Address");

require("dotenv").config();

const keyAPI = process.env.API_KEY;
const openSourceAPIKEY = process.env.OPEN_SOURCE_API_KEY;

function delay(time = 20) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const getCoordinates = async (peopleAddresses) => {
  const geoPeopleAddresses = [];

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
  //     // converting back co-ordinates to the address
  //     //const geoMiddle = getCenter(geoPeopleAddresses);
  //     // const middleAddress = await axios.get(
  //     //   `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${keyAPI}&pos=${geoMiddle.latitude},${geoMiddle.longitude},0&mode=retrieveAll&prox=${geoMiddle.latitude},${geoMiddle.longitude},5`
  //     // );
  //     // console.log(middleAddress.data.Response.View[0].Result[0].Location);
  //     //return middleAddress.data.Response.View[0].Result[0].Location
  //     //.DisplayPosition;
  //     //return middleAddress.data.Response.View[0].Result[0].Location; // Saving the label (city, country and so on)
  //   });
  //   console.log(geoPeopleAddresses);
  //   return geoPeopleAddresses;
  // } catch (error) {
  //   throw new Error(error);
  // }
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

// exports.getClosestCity = async (geoMiddle) => {
//   const middleAddress = await axios.get(
//     `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${keyAPI}&pos=${geoMiddle.latitude},${geoMiddle.longitude},0&mode=retrieveAll&prox=${geoMiddle.latitude},${geoMiddle.longitude},5`
//   );
//   console.log(middleAddress.data.Response.View[0].Result[0].Location);
//   return middleAddress.data.Response.View[0].Result[0].Location;
// };

// exports.getLocationData = async (peopleAddresses) => {
//   const geoPeopleAddresses = await getCoordinates(peopleAddresses);
//   console.log(geoPeopleAddresses);
//   // geolib function to find center of all the points
//   const geoMiddle = getCenterOfBounds(geoPeopleAddresses);
//   // geolib function to find min and max of the bounds of coordinates
//   const geoBoundsAddresses = getBounds(geoPeopleAddresses);
//   try {
//     console.log("request POI from openSource");
//     const POI = axios.create({
//       headers: {
//         Accept:
//           "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
//         Authorization: openSourceAPIKEY,
//         "Content-Type": "application/json; charset=utf-8",
//       },
//     });
//     let url = "https://api.openrouteservice.org/pois";
//     let body = {
//       request: "pois",
//       geometry: {
//         bbox: [
//           [geoMiddle.latitude, geoMiddle.longitude],
//           [8.7834, 53.0456],
//         ],
//         geojson: {
//           type: "Point",
//           coordinates: [geoMiddle.latitude, geoMiddle.longitude],
//         },
//         buffer: 200,
//       },
//     };
//     let getPOI = POI.post(url, body);
//     console.log(getPOI.data);
//     return { geoMiddle, geoPeopleAddresses, geoBoundsAddresses, getPOI };
//   } catch (error) {
//     throw new Error(error);
//   }
// };
