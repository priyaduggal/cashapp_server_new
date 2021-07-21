"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  name: {
    type: String
  },
  phone: {
    type: Number,
    default: ""
  },
  country:{
    type: String,
    default: ""
  },
  country_iso: {
    type: String,
    default: ""
  },
  state:{
    type: String,
    default: ""
  },
  state_iso: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  email: {
    type: String
  },
  image: {
    type: String,
    data: Buffer,
    default: ""
  },
  password: {
    type: String
  },
  access_token: {
    type: String,
    default: ""
  },
//   email_verified: {
//     type: Boolean,
//     default: false
//   },
//   verification_link: {
//     type: String,
//     default: ""
//   },
  reset_password_token: {
    type: String,
    default: ""
  },
  reset_password_expires: {
    type: Date,
    default: ""
  },
  status: {
  type: String,
  default: "1"
},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }

});



module.exports = mongoose.model("admin", adminSchema);
