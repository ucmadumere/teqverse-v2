const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Country, State, City } = require('country-state-city');

const addressSchema = new Schema({
  country: {
    type: String,
    enum: ['Nigeria'],
    required: true,
  },
  state: {
    type: String,
    enum: State.getStatesOfCountry('NG').map((state) => state.name),
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
});

module.exports = addressSchema;
