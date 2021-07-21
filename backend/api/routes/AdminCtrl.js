"use strict";

var mongoose = require("mongoose"),
	Admin = mongoose.model("admin"),
	// Card = mongoose.model("card"),
	path = require("path"),
	fs = require("fs"),
  multer = require("multer");

var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var jwt = require("jsonwebtoken");
var config = require("../../config/default.json");
var statuscode = require("../../config/statuscodes.json");
var crypto = require("crypto");
var bcrypt = require("bcryptjs");
var jwtToken = "Cashapptoken";
let csc = require('country-state-city').default;
var errors= ['',null,undefined,'null','undefined',0];
var stripe = require('stripe')('sk_test_51IxqwqDRqWq4J1reAqrZYK2M2G4vCkCas8usgd6YEVf4BCDXdkkoHZl4UPhqmAFrpDlB5FLMMDNS34Azzk59HBcW00g1GeZFx6');
var transporter = nodemailer.createTransport(
	smtpTransport({
		service: "gmail",
		auth: {
			user: "cashifyapp233@gmail.com",
			pass: "Indiit@123"
		}
	})
);







// /************GET COUNTRIES************ */

// exports.getCountries = async ({ body }, res) => {
// 	try {
//     let countries = csc.getAllCountries();
// 			if (countries) {
// 				res.json({ status: statuscode.SUCCESS, msg: "Countries Fetched Successfully!", data: countries });
// 			} else {
// 				res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! Unable to fetch!", data: "" });
// 			}

// 	} catch (e) {
// 		res.json({ status: statuscode.SERVER_ERROR, msg: "Server error!" });
// 	}
// };


// /************GET STATES************ */

// exports.getStates = async ({ body }, res) => {
// 	try {
//     let states = csc.getStatesOfCountry(body.country);

// 			if (states) {
// 				res.json({ status: statuscode.SUCCESS, msg: "States Fetched Successfully!", data: states });
// 			} else {
// 				res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! Unable to fetch!", data: "" });
// 			}

// 	} catch (e) {
// 		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
// 	}
// };


/************LOGIN************ */
exports.create_credentials = async({ body }, res) => {
   console.log('in create');
	await Admin.insert(
		{
		  name: "Demo",
		  email: "demou0017@gmail.com",
		  password: "Demo@123"
		}
	  );
	  res.json({ status: statuscode.SUCCESS, msg: "Created Successfully!", data: null });
	}

exports.login_admin = async ({ body }, res) => {
	try {
		Admin.findOne({ email: body.email }, function(err, userexist) {
			if (userexist) {
				const passwordmatch = bcrypt.compareSync(body.password, userexist.password);
				console.log(passwordmatch);
				if (passwordmatch) {
					res.json({ status: statuscode.SUCCESS, msg: "Login Successfully!", data: userexist });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "Incorrect Password" });
				}
			} else {
				res.json({ status: statuscode.UNAUTHORIZED, msg: "Sorry! No user exist with this email!" });
			}
		});
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};

/************GET BY USERID************ */

exports.getByAdminId = async ({ body }, res) => {
	try {
		Admin.findOne({ _id: body.user_id }, function(err, userdata) {
			if (userdata) {
				res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!", data: userdata });
			} else {
				res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! No user exist!", data: "" });
			}
		});
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!", data: ""  });
	}
};

/************MATCH OLD PASS************ */


exports.matcholdPass = async ({ body }, res) => {
	try {
		Admin.findOne({ _id: body.user_id }, function(err, userexist) {
			if (userexist) {
				const passwordmatch = bcrypt.compareSync(body.oldpassword, userexist.password);
				console.log(passwordmatch);
				if (passwordmatch) {
					
				res.json({
					error: null,
					status: statuscode.SUCCESS,
					msg: "Password has been matched!"
				});
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "Old Password does not match" });
				}
			} else {
				res.json({ status: statuscode.UNAUTHORIZED, msg: "Sorry! Data not found!" });
			}
		});
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};

