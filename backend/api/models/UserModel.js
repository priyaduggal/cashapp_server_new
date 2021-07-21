"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  phone: {
    type: Number,
    default: ""
  },
  wallet: {
    type: String,
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
state_iso: {
type: String,
default: ""
},
  state:{
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  street: {
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
  email_verified: {
    type: Boolean,
    default: false
  },
  verification_link: {
    type: String,
    default: ""
  },
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
  updated_at: { type: Date, default: Date.now },
    account_id: {
    type: String,
    default: null
  },
  id_proof:{
 type: String,
    default: ""

  },
  approved_id:{

type: Number,
  default: "0"
  },
  sendrequests:{
type:Boolean,
default:false

  },
  acceptrequests:{
type:Boolean,
default:false
  },
  rejectrequests:{
type:Boolean,
default:false
  },
   paidrequests:{
type:Boolean,
default:false
  },
  send_id:{
 type: String,
    default: ""

  },
  accept_id:{
 type: String,
    default: ""

  },
  reject_id:{
 type: String,
    default: ""

  },
  paid_id:{
 type: String,
    default: ""

  },money_bank:{
 type: String,
    default: ""

  },money_wallet:{
 type: String,
    default: ""

  },
  fcm_token:{
  type: String,
  default: null

  }


});







var cardSchema=new Schema({
   user_id: {
    type: String
  },
  card_name: {
    type: String
  },
  card_no: {
    type: String
  },
  exp_month: {
    type: Number,
    default: ""
  },
  exp_year: {
    type: String,
    default: ""
  },
  cvv:{
    type: String,
    default: ""
  }

});


var WalletSchema=new Schema({
   user_id: {
    type: String
  },
  transaction_id: {
    type: String
  },
  amount: {
    type: Number,
  },
  status: {
    type: Number,
    default: "1"
  },
  created_at: {
      type: Date,
      default : new Date()
    }

});



var WalletbankpayoutSchema=new Schema({
   user_id: {
    type: String
  },
  transaction_id: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: "0"
  },
  status: {
    type: Number,
    default: "1"
  },
  created_at: {
      type: Date,
      default : new Date()
    }

});



var UserrequestSchema=new Schema({
   from_id: {
    type: String
  },
  to_id: {
    type: String,
  },
  amount: {
    type: Number,
    default: "0"
  },
  status: {
    type: Number,
    default: "0"
  },
  created_at: {
      type: Date,
      default : new Date()
    }

});



var NotificationsSchema=new Schema({
   from_id: {
    type: String
  },
  to_id: {
    type: String,
  },
  title: {
     type: String,
  },
  description: {
   type: String,
  },
   linked_url: {
   type: String,
  },
    linked_id: {
   type: String,
  },
  linked_table: {
   type: String,
  },
  amount: {
    type: String,
    default: null
  },
   status: {
    type: Number,
    default: "0"
  },
  read: {
    type: Number,
    default: "0"
  },
  created_at: {
      type: Date,
      default : new Date()
    }

});

var TransactionSchema=new Schema({
   to_id: {
    type: String
  },
    from_id: {
    type: String
  },
  amount: {
    type: String
  },
  action: {
    type: Number,
  },
  status: {
    type: Number,
    default: "1"
  },
   medium: {
    type: String,
     default: null

  },
   card_id: {
    type: String,
     default: null

  },
  created_at: {
      type: Date,
      default : new Date()
    }

});

module.exports = mongoose.model("user", userSchema);
module.exports = mongoose.model("card", cardSchema);
module.exports = mongoose.model("wallet", WalletSchema);
module.exports = mongoose.model("walletbankpayout", WalletbankpayoutSchema);
module.exports = mongoose.model("userrequest", UserrequestSchema);
module.exports = mongoose.model("notifications", NotificationsSchema);
module.exports = mongoose.model("transaction", TransactionSchema);
