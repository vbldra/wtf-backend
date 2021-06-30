const mongoose = require("mongoose");
const { Schema } = mongoose;
const AddressSchema = new Schema({
  location: {
    type: String,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
});
module.exports = mongoose.model("Address", AddressSchema);
