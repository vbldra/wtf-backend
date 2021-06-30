const { default: axios } = require("axios");

const { getCenterOfBounds } = require("geolib");
const { getCenter } = require("geolib");
require("dotenv").config();
const keyAPI = process.env.API_KEY;
const getCoordinates = async (peopleAddresses) => {
    const geoPeopleAddresses = []; // array for co-ordinates
    try {
        for (const person in peopleAddresses) {
            if (peopleAddresses[person]) {
                // converting all the input fields to co-ordinates
                const geoPosition = await axios(
                    `https://geocode.search.hereapi.com/v1/geocode?q=${peopleAddresses[person]}&apiKey=${keyAPI}`
                );
                let lat = geoPosition.data.items[0].position.lat;
                let lng = geoPosition.data.items[0].position.lng;
                geoPeopleAddresses.push({ latitude: lat, longitude: lng });

                // converting back co-ordinates to the address
            }
        }
        // geolib function to find center of all the points
        const geoMiddle = getCenterOfBounds(geoPeopleAddresses);
        console.log(geoPeopleAddresses);
        const sharingData = [{ middlePoint: geoMiddle, peopleAddresses: geoPeopleAddresses }];
        return sharingData;

        //const geoMiddle = getCenter(geoPeopleAddresses);
        // const middleAddress = await axios.get(
        //   `https://reverse.geocoder.ls.hereapi.com/6.2/reversegeocode.json?apiKey=${keyAPI}&pos=${geoMiddle.latitude},${geoMiddle.longitude},0&mode=retrieveAll&prox=${geoMiddle.latitude},${geoMiddle.longitude},5`
        // );
        // console.log(middleAddress.data.Response.View[0].Result[0].Location);
        // console.log(geoMiddle);
        //return middleAddress.data.Response.View[0].Result[0].Location
        //.DisplayPosition;
        //return middleAddress.data.Response.View[0].Result[0].Location; // Saving the label (city, country and so on)
    } catch (error) {
        throw new Error(error);
    }
};
module.exports = getCoordinates;
