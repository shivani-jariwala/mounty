//mongoDB Schema
const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    coordinatesType: {
      type: String,
      default:"Point",
    },
    coordinates: {
      type: [Number],
      index:"2dsphere",
      required: true,
    },
  },
  created_at: {
    type: Date,
    required:true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required:true,
    default: Date.now,
  },
  
});

module.exports = mongoose.model('user', UserSchema);