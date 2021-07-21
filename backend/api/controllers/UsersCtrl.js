"use strict";

var mongoose = require("mongoose"),
	User = mongoose.model("user"),
	Card = mongoose.model("card"),
	Wallet = mongoose.model("wallet"),
	walletbankpayout = mongoose.model("walletbankpayout"),
	notifications = mongoose.model("notifications"),
	userrequest = mongoose.model("userrequest"),
	transaction = mongoose.model("transaction"),

	path = require("path"),
	fs = require("fs");


var arraySort = require('array-sort');
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
var multer = require("multer");
var FCM = require('fcm-node');
var serverKey = 'AAAAtZzykvw:APA91bHs2lEhomJiZdT4Ovg7rpc74vR0Fbv2R73C7uEWXmlGi4L1WrhIfPsKwCyvEEaMWDVDLK9Lvag3XKaev_DkekDEawZKbM5hrtUTYeFZ_t4PyQcNwPxbIi8lvvAD74knJN2kbSCK'; //put your server key here
var fcm = new FCM(serverKey);
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

/************LOGIN************ */


exports.addcard = async ({ body }, res) => {

	 var new_favourite = new Card({
      user_id : body.user_id,
      card_name : body.name,
      card_no: body.number,
      exp_month:body.expMonth,
      exp_year:body.expYear,
      cvv:'121',
    });
   
    new_favourite.save(function(err,qry){

				if(qry == null){
					res.json({ status: 500, msg: err });

				}else{

					res.json({ status: 200, msg: "Added successfully" });

				}
    });

};
exports.getcardwithid = async ({ body }, res) => {

	  Card.findOne({ _id: body._id }, function(err, carddata) {
			  if (carddata) {


					res.json({ status: 200, msg: "Added successfully" ,data:carddata});

			  }else
			  {

          	res.json({ status: 500, msg: 'Card not exist' });
			  }
			});
};

exports.getMycontacts = async ({ body }, res) => {
	 var counter = 0,all_notifications = [],uid = '', dict = {};
	 var i=0;
 body.contacts.forEach(function(con){

 
 	if(errors.indexOf(con._objectInstance.phoneNumbers) == -1 ){
 		i=i + 1;
 		var counter1 = 0;
 	
		
 
 		 	  	User.findOne({ phone:	con._objectInstance.phoneNumbers[0].value }, function(err, user) {
 		 	  			if(errors.indexOf(user) == -1){

								dict = {
											displayName :user.first_name,
											lastanme:user.last_name,
											phone : user.phone,
											photos:con._objectInstance.photos,
										
											};
												
										all_notifications.push(dict);

 		 	  			}

									
										counter = counter + 1;
									
										if(counter ==i){

										res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!",

										data: arraySort(all_notifications) });
										}

 		 	  	});


 		 }

 	});

 };

exports.setnotification = async ({ body }, res) => {
if(body.type==1){
		User.updateOne(
					{ _id: body.user_id },
					{
						$set: {
							sendrequests: true,
							send_id: body.id,
						}
					},
					{ new: true },
					function(err, updated) {
					}
				);
	}else if(body.type==2){
		User.updateOne(
							{ _id: body.user_id },
							{
								$set: {
									acceptrequests: true,
									accept_id: body.id,
								}
							},
							{ new: true },
							function(err, updated) {
							}
						);
	}else if(body.type==3){
		User.updateOne(
							{ _id: body.user_id },
							{
								$set: {
									rejectrequests: true,
									reject_id: body.id,
								}
							},
							{ new: true },
							function(err, updated) {
							}
						);

	}else if(body.type==5){
		User.updateOne(
							{ _id: body.user_id },
							{
								$set: {
									
									money_bank: body.id,
								}
							},
							{ new: true },
							function(err, updated) {
							}
						);

	}else if(body.type==6){
		User.updateOne(
							{ _id: body.user_id },
							{
								$set: {
									
									money_wallet: body.id,
								}
							},
							{ new: true },
							function(err, updated) {
							}
						);

	}else{
	User.updateOne(
							{ _id: body.user_id },
							{
								$set: {
									paidrequests: true,
									paid_id: body.id,
								}
							},
							{ new: true },
							function(err, updated) {
							}
						);
	}


	res.json({ status: 200, msg: "Updated Successfully", data:[] });

};
exports.getusertransactions = async ({ body }, res) => {
transaction.count({to_id : body.user_id}, function(err, count) {

transaction.find({to_id : body.user_id},null,{skip: body.start, limit: body.records_per_page, sort: {'created_at': -1}}, function(err, userexist) {
			if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.from_id }, function(err, user) {
 												if(errors.indexOf(user) == -1){

														dict = {
														notification :notification,
														user : user,
														created_at : notification.created_at
														};

														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!",
															total:count,
														 data: arraySort(all_notifications, 'created_at', {reverse: true}) });
														}

 												}

                  	});
				  });
					
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found", data:[] });
				}
			
		});
});

};
exports.getTransactiondetails = async ({ body }, res) => {

transaction.remove({medium : null}, function(err, task) {
     

    });


	transaction.findOne({_id : body._id}, function(err, trans) {

		if(errors.indexOf(trans) == -1){
 
	 	User.findOne({ _id: trans.from_id }, function(err, user) {


	    res.json({ status: 200, msg: "Fetched Successfully" ,data:trans,user:user});
	  });

		}else{
			res.json({ status: 500, msg: "Transaction not exist" });
		}


	});

};
exports.deletecard = async ({ body }, res) => {
Card.remove({_id :body.id}, function(err, task) {
     
	res.json({ status:200, msg: "Deleted successfully" });
 });
};
exports.editcard = async ({ body }, res) => {
		Card.updateOne(
					{ _id: body.cardid },
					{
						$set: {
							card_name : body.name,
							card_no: body.number,
							exp_month:body.expMonth,
							exp_year:body.expYear,
							cvv:'121',
						}
					},
					{ new: true },
					function(err, updated) {
						res.json({ status:200, msg: "Updated Successfully" });
					}
				);
};
exports.getNotifications = async ({ body }, res) => {
notifications.updateOne({ to_id:body.user_id },{$set: {read: 1,}},{ new: true },function(err, updated) {

});
												
 notifications.count({to_id : body.user_id},function(ersr, count) {
	notifications.find({to_id : body.user_id},null,{skip: body.start, limit: body.records_per_page, sort: {'created_at': -1}}, 
		function(err, userexist) {
			if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.from_id }, function(err, user) {
 												if(errors.indexOf(user) == -1){

														dict = {
														notification :notification,
														user : user,
														created_at:notification.created_at,
														};

														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS,
														 msg: "Fetched Successfully!",
														   total: count,
														 data: arraySort(all_notifications, 'created_at', {reverse: true}) });
														}

 												}

                  	});
				  });
					
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found" ,data:[]});
				}
			
		});
});
};
exports.searchusers = async ({ body }, res) => {

var conditions = {_id : {$ne : body.user_id}};
var text=body.text.split(" ");
 var conditions = {first_name:text[0] , last_name:text[1]};
// conditions['$or'] = [ 
//       {first_name : { '$regex' :body.text, '$options' : 'i' }},
//       {last_name : { '$regex' : body.text, '$options' : 'i' }} 
//     ]
	User.find(conditions,'first_name last_name _id', function(err, userexist) {
			if (userexist.length>0) {
				
					res.json({ status: statuscode.SUCCESS, msg: "Login Successfully!", data: userexist });
				} else {
					res.json({ status: statuscode.SUCCESS, msg: "Incorrect Password" ,data: []});
				}
			
		});


};
exports.allusers = async ({ body }, res) => {

		User.find({_id : {$ne : body.user_id}}, function(err, userexist) {
			if (userexist.length>0) {
				
					res.json({ status: statuscode.SUCCESS, msg: "Login Successfully!", data: userexist });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "Incorrect Password" });
				}
			
		});
	
};
exports.login_user = async ({ body }, res) => {
	try {
		User.findOne({ email: body.email, email_verified: true }, function(err, userexist) {
			if (userexist) {
				const passwordmatch = bcrypt.compareSync(body.password, userexist.password);
				console.log(passwordmatch);
				if (passwordmatch) {
						User.updateOne(
                  { _id: userexist._id },
                  {
                      $set: {
                          fcm_token: body.fcm_token
                      }
                  },
                  { new: true },
                  function(err, updated) {
                  });
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

/*************SIGNUP************/


exports.contactAdmin = async ({ body }, res) => {
User.findOne({ _id: body.user_id }, function(usererr, userexist) {
	if (userexist) {

	sendcontactemail(body, userexist);

					res.json({
						error: null,
						status: statuscode.SUCCESS,
						data: userexist,
						msg: "We have send your query to admin!"
					});
	}else
	{


	}
});
};
exports.add_user = async ({ body }, res) => {
	console.log(body);
	User.findOne({ email: body.email }, function(usererr, userexist) {


		if (userdata) {
    console.log('work start');
    console.log(userexist);
		var data = JSON.stringify(userexist);
		console.log(JSON.parse(data));
		var userdata = JSON.parse(data);
    console.log('work start2');
			if (userdata.email_verified == false) {
				console.log("entered update mode");
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(body.password, salt);

				User.updateOne(
					{ _id: userdata._id },
					{
						$set: {
							first_name: body.firstName,
							last_name: body.lastName,
							email: body.email,
							password: hash,
							email_verified: false,
								fcm_token:body.fcm_token
						}
					},
					{ new: true },
					function(err, updated) {
						console.log("yes");
						console.log(updated);
					}
				);
				res.json({
					error: null,
					status: statuscode.SUCCESS,
					data: userdata,
					msg: "We have sent a link to your Email, Please verify First!"
				});
			} else {
				res.json({
					statuscode: statuscode.BAD_REQUEST,
					msg: "User with this email already exist! Try different Email!"
				});
			}
		} else {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(body.password, salt);

			var new_user = new User({
				first_name: body.firstName,
				last_name: body.lastName,
				email: body.email,
				password: hash
			});

			new_user.save(function(err, user) {
				if (user == null) {
					res.json({
						error: err,
						status: statuscode.SUCCESS,
						data: null
					});
				} else {
					console.log("sending mail");
					sendVerificationEmail(body, user);

					res.json({
						error: null,
						status: statuscode.SUCCESS,
						data: user,
						msg: "We have sent a link to your Email, Please verify First!"
					});
				}
			});
		}
	});
};



/************SEND VERIFICATION EMAIL************ */

function sendcontactemail(body, user) {
const credentials = {
		email: 'priyaindiit@gmail.com',
		time: new Date().getTime()
	};
	console.log(credentials);
		const token = jwt.sign(credentials, jwtToken, { algorithm: "HS256" });

const mailOptions = {
		from: '"CashApp 🖐" <cashifyapp233@gmail.com>',
		to: 'priyaindiit@gmail.com',
		subject: "Contact Admin ✔",
		text: "CashApp ",
		html: `
          <br>
          <p>Hey 

          <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td >
                <b>Subject</b> :${body.subject}</td>
          </tr>
           <tr>
                  <td  >
                 <b>Description</b> :${body.description}</td>
          </tr>
          </table>
          <br>
          <br>
          <br>
          Email sent by CashApp.<br>
          CashApp. <br>
          All rights reserved
          <br>
    `
	};
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) console.log("Error detected " + err);
		else console.log(info);
	});



}
function sendVerificationEmail(body, user) {
	console.log(body.email);
	console.log("enter sendemail");
	const credentials = {
		email: body.email,
		time: new Date().getTime()
	};
	console.log(credentials);
	const token = jwt.sign(credentials, jwtToken, { algorithm: "HS256" });
	console.log(token);
	User.updateOne(
		{ _id: user._id },
		{
			$set: {
				verification_link: token
			}
		},
		{ new: true },
		function(err, updated) {
			console.log(updated);
		}
	);

	const mailOptions = {
		from: '"CashApp 🖐" <cashifyapp233@gmail.com>',
		to: body.email,
		subject: "Verification Email ✔",
		text: "CashApp ",
		html: `
          <br>
          <p>Hey <br>Click the big blue button below to verify your email address.</p>

          <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td align="center" style="border-radius: 3px;" bgcolor="#0000FF"><a href="${config.baseUrl}mailverification/${token}" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 24px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Verify email</a></td>
          </tr>
          </table>
          <br>
          <br>
          <br>
          Email sent by CashApp.<br>
          CashApp. <br>
          All rights reserved
          <br>
    `
	};
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) console.log("Error detected " + err);
		else console.log(info);
	});
}

/******SHOW TEMPLATE IF EMAIL IS VERIFIED OR NOT****** */

exports.mailverification = async (req, res) => {
	try {
		const verificationlink = req.params.verificationLink;
		let user = await User.findOne({ verification_link: verificationlink });

		console.log(user.email_verified);
		if (user.email_verified == false) {
			User.updateOne(
				{ _id: user._id },
				{
					$set: {
						email_verified: true
					}
				},
				{ new: true },
				function(err, updated) {
					console.log(updated);
					res.write("<b>Your Email has been Verified !!</b>");
				}
			);
		} else {
			User.updateOne(
				{ _id: user._id },
				{
					$set: {
						email_verified: true
					}
				},
				{ new: true },
				function(err, updated) {
					console.log(updated);
					res.write("<b>Your Email has already been Verified !!</b>");
				}
			);
		}
	} catch (e) {
		res.write("<b>Something Went Wrong!</b>");
	}
};

/************GET BY USERID************ */

exports.getByUserId = async ({ body }, res) => {
	try {
		User.findOne({ _id: body.user_id }, function(err, userdata) {
			if (userdata) {
				res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!", data: userdata });
			} else {
				res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! No user exist!", data: "" });
			}
		});
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};

/***************FORGOT PASSWORD*************** */

exports.forgotpassword = async ({ body }, res) => {
	try {
		let user = await User.findOne({ email: body.email });

		if (user) {
			if (user.email_verified == false) {
				res.json({
					status: statuscode.BAD_REQUEST,
					msg: "User not Registered with this email or the email has not been verified!"
				});
			} else {
				const credentials = {
					email: body.email,
					time: new Date().getTime()
				};

				const token = jwt.sign(credentials, jwtToken, { algorithm: "HS256" });
				let resettoken = crypto.randomBytes(32).toString("hex");
				console.log(body.email);
				User.updateOne(
					{ _id: user._id },
					{
						$set: {
							reset_password_token: resettoken,
							reset_password_expires: Date.now()
						}
					},
					{ new: true },
					function(err, updated) {
						console.log(updated);
					}
				);

				const mailOptions = {
					from: '"CashApp 🖐" <cashifyapp233@gmail.com>', // sender address
					to: body.email, // list of receivers
					subject: "Forgot password ☹", // Subject line
					text: "CashApp",
					html: `
          <br>
          <p>Hey ${user.first_name} <br>Click on the button below to reset your password.</p>

          <table border="0" cellspacing="0" cellpadding="0">
              <tr>
                  <td align="center" style="border-radius: 3px;" bgcolor="#0000FF"><a href="${config.baseUrl}reset/${resettoken}" style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 24px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Reset Password</a></td>
          </tr>
          </table>
          <br>
          <br>
          <br>
          Email sent by CashAPP.<br>
          All rights reserved
          <br>
          `
				};

				transporter.sendMail(mailOptions, function(err, info) {
					if (err) console.log(err);
					else res.json({ status: statuscode.SUCCESS, msg: "Reset password link has been sent, please check your email!" });
				});
			}
		} else {
			res.json({ status: statuscode.BAD_REQUEST, msg: "User not Registered with this Email!" });
		}
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Something went wrong!" });
	}
};

/******************RESET PASSWORD TEMPLATE********* */

exports.reset = function(req, res) {
	console.log(req.params.token);

	User.findOne({ reset_password_token: req.params.token }, function(err, user) {
		console.log(user);
		if (!user) {
			console.log("IF");
			res.write("<b>Password reset token is invalid or has expired.<b>");
		} else {
			console.log("coming");
			fs.readFile("api/controllers/resetpassword.html", function(error, data) {
				console.log("is working");
				if (error) {
					console.log(error);
					res.writeHead(404);
					res.write("Contents you are looking for Not Found");
				} else {
					res.write(data);
				}
				res.end();
			});
		}
	});
};

/**********SET NEW PASSWORD************ */

exports.resetpass = async (req, res) => {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.Password, salt);

	let user = await User.findOne({ reset_password_token: req.params.token });

	User.updateOne(
		{ reset_password_token: req.params.token },
		{
			$set: {
				reset_password_token: "",
				reset_password_expires: Date.now(),
				password: hash
			}
		},
		{ new: true },
		function(err, updated) {
			console.log(err);
			console.log(updated);

			const mailOptions = {
				from: '"CashApp 🖐" <demou0017@gmail.com>', // sender address
				to: user.email, // list of receivers
				subject: "Password Confirmation ✔", // Subject line
				text: "CashApp",
				html: `
          <br>
          <p>Hey ${user.first_name} <br>

          This is a confirmation that the password for your account ${user.email} has just been changed.</p>
          <br>
          <br>
          <br>
          Email sent by CashAPp.<br>
          CashApp <br>
          All rights reserved
          <br>
          `
			};

			transporter.sendMail(mailOptions, function(err, info) {
				if (err) console.log(err);
				else res.json({ status: statuscode.SUCCESS, msg: "Email has been sent, please check your email!" });
			});

			res.json({ status: statuscode.SUCCESS, msg: "Password has been changed Successfully!" });
		}
	);
};

/************UPLOADING IMAGE************ */


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "../images/");
  },
  filename: (req, file, cb) => {
      var fileName = file.originalname;
      cb(null, fileName.replace(/\s/g, ""));
  }
});
var upload = multer({ storage: storage ,limits: { fieldSize: 25 * 1024 * 1024 }}).single("image");


exports.uploadIdImage = function(req, res) {
console.log('in backend:',req.body);

  upload(req, res, function(err) {
      if (err) {
          res.json({ error_code: statuscode.BAD_REQUEST, err_desc: err });
          return;
      }

      User.findOne({ _id: req.body.id, email_verified: true }, function(err, userdata) {
          if (userdata) {
            let base64Image = req.body.image;
              User.updateOne(
                  { _id: userdata._id },
                  {
                      $set: {
                          id_proof: base64Image
                      }
                  },
                  { new: true },
                  function(err, updated) {
                      console.log("yes");
                      console.log(updated);
                      if(updated.nModified == 1){
                        User.findOne({ _id: userdata._id , email_verified: true }, function(err, userdat) {
                          if(userdat){
                            res.json({ status: statuscode.SUCCESS, msg: "ID proof updated successfully .. Waiting for admin approval!", data: userdat });
                          }
                        });
                      }
                  }
              );
          } else {
              res.json({ status: statuscode.UNAUTHORIZED, msg: "Sorry! No user exists!", data: "" });
          }
      });
  });
};
exports.uploadImage = function(req, res) {

  console.log('in backend:',req.body);


  upload(req, res, function(err) {
      if (err) {
          res.json({ error_code: statuscode.BAD_REQUEST, err_desc: err });
          return;
      }

      User.findOne({ _id: req.body.id, email_verified: true }, function(err, userdata) {
          if (userdata) {
            let base64Image = req.body.image;
              User.updateOne(
                  { _id: userdata._id },
                  {
                      $set: {
                          image: base64Image
                      }
                  },
                  { new: true },
                  function(err, updated) {
                      console.log("yes");
                      console.log(updated);
                      if(updated.nModified == 1){
                        User.findOne({ _id: userdata._id , email_verified: true }, function(err, userdat) {
                          if(userdat){
                            res.json({ status: statuscode.SUCCESS, msg: "Image updated Successfully!", data: userdat });
                          }
                        });
                      }
                  }
              );
          } else {
              res.json({ status: statuscode.UNAUTHORIZED, msg: "Sorry! No user exists!", data: "" });
          }
      });
  });
};


/************DELETING IMAGE************ */


exports.deleteImage = function(req, res) {
  upload(req, res, function(err) {
    if (err) {
        res.json({ error_code: statuscode.BAD_REQUEST, err_desc: err });
        return;
    }

    User.findOne({ _id: req.body.id, email_verified: true }, function(err, userdata) {
        if (userdata) {
          // let base64Image = 'data:image/jpeg;base64,' + req.body.image;
            User.updateOne(
                { _id: userdata._id },
                {
                    $set: {
                        image: req.body.image
                    }
                },
                { new: true },
                function(err, updated) {
                    console.log("yes");
                    console.log(updated);
                    if(updated.nModified == 1){
                      User.findOne({ _id: userdata._id , email_verified: true }, function(err, userdat) {
                        if(userdat){
                          res.json({ status: statuscode.SUCCESS, msg: "Image deleted Successfully!", data: userdat });
                        }
                      });
                    }
                }
            );
        } else {
            res.json({ status: statuscode.UNAUTHORIZED, msg: "Sorry! No user exists!", data: "" });
        }
    });
});
};


/************LOGIN************ */
/************GET COUNTRIES************ */
exports.stripe_redirect = async (req, res) => {

if(errors.indexOf(req.query)==-1){
var code = req.query.code;
var user_id=req.query.state;
var id = req.query.state;
var code1 = req.query.code;

 User.findOne({ _id:id }, function(err, userexist) {

			if (userexist) {

				stripe.oauth.token(
				{
				grant_type: 'authorization_code',
				code: code1,

				},
				function(errtoken, token) {
				 if(errors.indexOf(token)==-1){

				 	var connected_account_id=token.stripe_user_id;

				 	User.updateOne(
					{ _id:userexist._id },
					{
						$set: {
							account_id: token.stripe_user_id
						}
					},
					{ new: true },
					function(err, updated) {
						console.log("yes");
						console.log(updated);
					});

					res.json({ status: statuscode.SUCCESS, data: userexist });

				}else
				{
					res.json({ status: statuscode.SUCCESS, msg: errtoken });
				}

				});

				
			}else
			{
              res.json({ status:500});
			}
		});
}else{
	res.json({ status:500 });
}

};


exports.approveRequest =async (req, res) => {




User.findOne({ _id: req.body.user_id }, function(usererr, userexist) {
 	if(errors.indexOf(userexist)==-1){
      
      if(req.body.type=='card')
      {
         

  Card.findOne({ _id: req.body.id_amt }, function(err, carddata) {
  if (carddata) {

		stripe.tokens.create(
		{
card: {
		number: carddata.card_no,
		exp_month:carddata.exp_month,
		exp_year: carddata.exp_year,
		cvc: carddata.cvv,
		},

		},
		function(errtoken, token) {
			 userrequest.findOne({ _id: req.body.reqid}, function(err, request) {
				 if(errors.indexOf(request)==-1){
          if(errors.indexOf(token)==-1){
			  
			
						stripe.customers.create(
						{
						'email' :userexist.email, // customer email id
						'source' : token.id, // stripe token generated by stripe.js
						'name' : userexist.first_name,
						'address' : {"city" :'khamano', "country" : "+1", "line1" : "khamano , rattom", "line2" : "khamano , ratton", "postal_code" :"12345", "state" : "fategarh sahib"}
						},
						function(errcustomer, customer) {
								if(errors.indexOf(customer)==-1){

								stripe.charges.create(
								{
								'currency' :'USD',
								'amount' :  Number(request.amount)*100,
								'description' : 'Paying to admin',
								'customer' : customer.id,

								},function(errcharge, charge) {
					                  if(errors.indexOf(charge)==-1){

										var add_payment = new Wallet({
										user_id : request.from_id,
										transaction_id :charge.id,
										amount: request.amount,
										status:1,

										});
										add_payment.save(function(err,qry){

										if(qry == null){
													res.json({ status: statuscode.SUCCESS, msg: err });
										}
										else{

													var add_payment1 = new transaction({
													from_id : req.body.user_id,
													to_id :request.from_id,
													amount: request.amount,
													action:1,
													status:1,
													medium:req.body.type,
													card_id:carddata._id,


													});
													add_payment1.save(function(err,qry){

													});



										Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {
										if(walletdata.length>0)
										{
										Card.find({ user_id: req.body.user_id }, function(err, mycards) {
										if(mycards.length>0)
										{
												notifications.updateOne({ _id:req.body.notid },{$set: {status:1,read: 1,}},{ new: true },function(err, updated) {
												if(updated){

															userrequest.updateOne({ _id:req.body.req_id },{$set: {status:1,}},{ new: true },function(errrequest, updatedrequest) {

																		if(updatedrequest){


																		res.json({ status: statuscode.SUCCESS, msg: "Added to wallet Successfully!" ,data:mycards,wallet:walletdata});

																		}

															});
												}

												});
										}	
										});
										}
										});
										}
										});
										}else{

														Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
														if(walletdata.length>0)
														{
														Card.find({ user_id: req.body.user_id }, function(err, mycards) {
														if(mycards.length>0)
														{
														res.json({ status: 500, msg: errcharge ,data:mycards,wallet:walletdata});
														}	
														});
														}
														});	    
											}

											});
										}else
										{

													Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
													if(walletdata.length>0)
													{
													Card.find({ user_id: req.body.user_id }, function(err, mycards) {
													if(mycards.length>0)
													{
													res.json({ status: 500, msg: errcustomer ,data:mycards,wallet:walletdata});
													}	
													});
													}
													});	  
										}
										});
										}else{

													Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
														if(walletdata.length>0)
														{
														Card.find({ user_id: req.body.user_id }, function(err, mycards) {
														if(mycards.length>0)
														{
														res.json({ status: 500, msg: errtoken ,data:mycards,wallet:walletdata});
														}	
														});
														}
													});

						}
				 }else
				 {
					 
					 
				 }
						
			 });

						});
						}else
										{
										res.json({ staus: statuscode.UNAUTHORIZED, msg: "Error occured", data: "" });
										}


});



      }else{

  
		  userrequest.findOne({ _id: req.body.reqid}, function(err, request) {
			  
		   User.findOne({ _id: request.from_id }, function(usererr, userexist1) {
			   
			   
			  if(errors.indexOf(userexist1.account_id)>=0){
				
					res.json({ staus:402, msg: "User account not connected", data: "" });				
			  }else
			  {
		  	stripe.transfers.create(
		{
		
			amount:  Number(request.amount)*100,
			currency: 'usd',
			destination: userexist1.account_id,
			transfer_group: 'Transfer to user account',
		

		},
		function(errtoken, token) {
			
			 if(errors.indexOf(token)==-1){
				var add_payment = new walletbankpayout({
				user_id : req.body.user_id,
				transaction_id :userexist1.account_id,
				amount: request.amount,
				status:1,

				});
				add_payment.save(function(err,qry){

				});
				
				var add_payment1 = new Wallet({
				user_id : request.from_id,
				transaction_id :userexist1.account_id,
				amount: request.amount,
				status:1,

				});
				add_payment1.save(function(err,qry){
					
				});

				var add_payment2 = new transaction({
				from_id : req.body.user_id,
				to_id :request.from_id,
				amount: request.amount,
				action:1,
				status:1,
				medium:req.body.type,
				card_id:'',

				});
			
				add_payment2.save(function(err,qry){

				});
				
				
				var add_payment3 = new transaction({
				from_id :request.from_id,
				to_id : req.body.user_id,
				amount: request.amount,
				action:2,
				status:1,
				medium:req.body.type,
				card_id:'',

				});
			
				add_payment3.save(function(err,qry){

				});
				
				
				
					var add_notification = new notifications({
										from_id : req.body.user_id,
										to_id :request.from_id,
										title: 'Amount Paid',
										description: 'Amount paid by user ',
										linked_url: 'requests',
										linked_id: req.body.reqid,
										linked_table: 'userrequest',
										amount:  request.amount,
										status: 0,
										read: 0,
								   	created_at : new Date()
										});
										add_notification.save(function(errnoti,qry){
											
										});
				
				notifications.updateOne({ _id:req.body.notid },{$set: {status:1,read: 1,}},{ new: true },function(err, updated) {
					
				});
				userrequest.updateOne({ _id:req.body.req_id },{$set: {status:1,}},{ new: true },function(errrequest, updatedrequest) {

				});
				



User.findOne({ _id: request.from_id}, function(tousererr, touser) {


						if(errors.indexOf(touser.fcm_token)==-1){
						var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
						to: touser.fcm_token, 
						// collapse_key: 'your_collapse_key',

						notification: {
						title: 'CashApp', 
						body: 'Money Received' 
						},

						data: {  //you can send only notisfication or only data(or include both)
						my_key: touser.paid_id,
						my_another_key: 'my another value'
						}
						};

						fcm.send(message, function(err, response){
						if (err) {
						console.log("Something has gone wrong!")
						} else {
						console.log("Successfully sent with response: ", response)
						}
						}) 
						}

						});


				res.json({ status: statuscode.SUCCESS, msg: "Paid successfully!"});

											
			 }else
			 {
				 res.json({ status:500, msg:errtoken});
			 }
		});
		  }
		  
	  });
		  });
	  
	
      } 

 	}else{

 		res.json({ status:500,msg:"User not exist" });

 	}
 });
};
exports.getnotificationcount =async (req, res) => {
 notifications.count({ to_id: req.body.user_id,read:0 }, function(usererr, notification) {

		res.json({ status:200,msg:"",data: notification});
 });
};
exports.rejectRequest =async (req, res) => {
     notifications.findOne({ _id: req.body.not_id }, function(usererr, notification) {
		 if(errors.indexOf(notification)==-1){
			notifications.updateOne({ _id:req.body.not_id },{$set: {status:2,read: 1,}},{ new: true },function(err, updated) {
					if(updated){
									userrequest.updateOne({ _id:req.body.req_id },{$set: {status:2,}},{ new: true },function(errrequest, updatedrequest) {

											var add_notification = new notifications({
										from_id : req.body.user_id,
										to_id :notification.from_id,
										title: 'Request Rejected',
										description: 'Request rejected by user ',
										linked_url: 'requests',
										linked_id: req.body.req_id,
										linked_table: 'userrequest',
										amount: 0,
										status: 0,
										read: 0,
									 	created_at : new Date()
										});
										add_notification.save(function(errnoti,qry){
													if(qry == null){
													res.json({ status: 500, msg: errnoti });
												}else
												{

															User.findOne({ _id: notification.from_id }, function(tousererr, touser) {
															if(errors.indexOf(touser.fcm_token)==-1){
															var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
															to: touser.fcm_token, 
															// collapse_key: 'your_collapse_key',

															notification: {
															title: 'CashApp', 
															body: 'Request Rejected' 
															},

															data: {  //you can send only notisfication or only data(or include both)
															my_key: touser.reject_id,
															my_another_key: 'my another value'
															}
															};

															fcm.send(message, function(err, response){
															if (err) {
															console.log("Something has gone wrong!")
															} else {
															console.log("Successfully sent with response: ", response)
															}
															}) 
															}

															});
                              res.json({ status:200,msg:'Request Rejected'});
												}

											});


									});

						}
						
					});
     }else
     {

     	 res.json({ status:500,msg:'Error occured'});
     }

   });

};




exports.payAmount =async (req, res) => {

User.findOne({ _id: req.body.user_id }, function(usererr, userexist) {
	if(errors.indexOf(userexist)==-1){
	  if(req.body.type=='card')
      {
		  Card.findOne({ _id: req.body.id_amt }, function(err, carddata) {
			  if (carddata) {
				  
							stripe.tokens.create(
							{
							card: {
							number: carddata.card_no,
							exp_month:carddata.exp_month,
							exp_year: carddata.exp_year,
							cvc: carddata.cvv,
							},

							},
							function(errtoken, token) {
								
								 if(errors.indexOf(token)==-1){
									 
									stripe.customers.create(
									{
									'email' :userexist.email, // customer email id
									'source' : token.id, // stripe token generated by stripe.js
									'name' : userexist.first_name,
									'address' : {"city" :'khamano', "country" : "+1", "line1" : "khamano , rattom", "line2" : "khamano , ratton", "postal_code" :"12345", "state" : "fategarh sahib"}
									},
									function(errcustomer, customer) {
										
										if(errors.indexOf(customer)==-1){

										stripe.charges.create(
										{
										'currency' :'USD',
										'amount' :  Number(req.body.amount)*100,
										'description' : 'Paying to admin',
										'customer' : customer.id,

										},function(errcharge, charge) {
											
											if(errors.indexOf(charge)==-1){
												
												var add_payment = new Wallet({
												user_id : req.body.toid,
												transaction_id :charge.id,
												amount: req.body.amount,
												status:1,

												});
												add_payment.save(function(err,qry){
												});
												
											
												var add_payment1 = new transaction({
												from_id : req.body.user_id,
												to_id : req.body.toid,
												amount: req.body.amount,
												action:1,
												status:1,
												medium:req.body.type,
												card_id:carddata._id,

												});
												add_payment1.save(function(err,qry){

												});

												res.json({ status:200 ,msg:'Paid successfully'}); 
												
											}else{
												res.json({ status:500 ,msg:'Server error occured'}); 
											}
											
										});
										
										}else{
										res.json({ status:500 ,msg:'Server error occured'}); 	
										}

									});
									 
									 
								 }else{
									 
									res.json({ status:500 ,msg:'Server error occured'}); 
									 
								 }
								
							});
				  
				  
			  }else{
				  
				  res.json({ status:500 ,msg:'Card on server not found'}); 
			  }
			  
		  });
	  }else
	  {
		   User.findOne({ _id: req.body.toid }, function(usererr, userexist1) {
			   if(errors.indexOf(userexist1.account_id)>=0){
				   res.json({ staus:402, msg: "User account not connected", data: "" });		
			   }else{
					stripe.transfers.create(
					{

					amount:  Number(req.body.amount)*100,
					currency: 'usd',
					destination: userexist1.account_id,
					transfer_group: 'Transfer to user account',


					},
					function(errtoken, token) {

					if(errors.indexOf(token)==-1){
						var add_payment = new walletbankpayout({
						user_id : req.body.user_id,
						transaction_id :userexist1.account_id,
						amount: req.body.amount,
						status:1,

						});
						add_payment.save(function(err,qry){

						});
						
						var add_payment1 = new Wallet({
						user_id : req.body.toid,
						transaction_id :userexist1.account_id,
						amount: req.body.amount,
						status:1,

						});
						add_payment1.save(function(err,qry){

						});
						
						var add_payment2 = new transaction({
						from_id : req.body.user_id,
						to_id :req.body.toid,
						amount: req.body.amount,
						action:1,
						status:1,
						medium:req.body.type,
						card_id:'',

						});

						add_payment2.save(function(err,qry){

						});
						
						var add_payment3 = new transaction({
						from_id :req.body.toid,
						to_id : req.body.user_id,
						amount: req.body.amount,
						action:2,
						status:1,

						});

						add_payment3.save(function(err,qry){

						});
						
						var add_notification = new notifications({
						from_id : req.body.user_id,
						to_id :req.body.toid,
						title: 'Amount Paid',
						description: 'Amount paid by user ',
						linked_url: 'requests',
						linked_id: '',
						linked_table: 'userrequest',
						amount:  req.body.amount,
						status: 0,
						read: 0,
 						created_at : new Date()
						});
						add_notification.save(function(errnoti,qry){

						});
						
	User.findOne({ _id: req.body.toid}, function(tousererr, touser) {


						if(errors.indexOf(touser.fcm_token)==-1){
						var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
						to: touser.fcm_token, 
						// collapse_key: 'your_collapse_key',

						notification: {
						title: 'CashApp', 
						body: 'Money Received' 
						},

						data: {  //you can send only notisfication or only data(or include both)
						my_key: touser.paid_id,
						my_another_key: 'my another value'
						}
						};

						fcm.send(message, function(err, response){
						if (err) {
						console.log("Something has gone wrong!")
						} else {
						console.log("Successfully sent with response: ", response)
						}
						}) 
						}

						});

						res.json({ status: statuscode.SUCCESS, msg: "Paid successfully!"});
					}
					});
			   }
		   });
		 
	  }
	}else{
	res.json({ status:500 ,msg:'User not found'}); 	
	}
	
});

};
exports.sendrequest =async (req, res) => {
 User.findOne({ _id: req.body.user_id }, function(usererr, userexist) {
 	if(errors.indexOf(userexist)==-1){

	var add_payment = new userrequest({
							from_id : req.body.user_id,
							to_id :req.body.toid,
							amount: req.body.amount,
							status:0,

							});
							add_payment.save(function(err,qry){

									if(qry == null){
									res.json({ status: 500, msg: err });
									}
									else{
										var add_notification = new notifications({
										from_id : req.body.user_id,
										to_id :req.body.toid,
										title: 'Request Received',
										description: 'Amount requested by user '+userexist.first_name+' '+userexist.last_name,
										linked_url: 'requests',
										linked_id: qry._id,
										linked_table: 'userrequest',
										amount: req.body.amount,
										status: 0,
										read: 0,
									 	created_at : new Date()
										});
										add_notification.save(function(errnoti,qry){
													if(qry == null){
													res.json({ status: 500, msg: errnoti });
													}else{

																User.findOne({ _id: req.body.toid }, function(tousererr, touser) {


																if(errors.indexOf(touser.fcm_token)==-1){
																var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
																to: touser.fcm_token, 
																// collapse_key: 'your_collapse_key',

																notification: {
																title: 'CashApp', 
																body: 'Request for money received' 
																},

																data: {  //you can send only notisfication or only data(or include both)
																my_key: touser.send_id,
																my_another_key: 'my another value'
																}
																};

																fcm.send(message, function(err, response){
																if (err) {
																console.log("Something has gone wrong!")
																} else {
																console.log("Successfully sent with response: ", response)
																}
																}) 
																}

																});




													res.json({ status: 200, msg: "Request send Successfully" });
													}
										});
									}


									
									});
								}else

 	{

 	res.json({ status:500 });	
 	}

 });



};


exports.sendmoneytobank = async (req, res) => {

  User.findOne({ _id: req.body.user_id}, function(err, carddata) {
  
   if(errors.indexOf(carddata)==-1){
   

   	stripe.transfers.create(
		{
		
			amount:  Number(req.body.amount)*100,
			currency: 'usd',
			destination: carddata.account_id,
			transfer_group: 'Transfer to user account',
		

		},
		function(errtoken, token) {

			 if(errors.indexOf(token)==-1){
             
							var add_payment = new walletbankpayout({
							user_id : req.body.user_id,
							transaction_id :carddata.account_id,
							amount: req.body.amount,
							status:1,

							});
							add_payment.save(function(err,qry){

									if(qry == null){
									res.json({ status: 500, msg: err });
									}
									else{


									Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {

									if(walletdata.length>0){	

									res.json({ status: statuscode.SUCCESS, amount: req.body.amount ,wallet:walletdata,msg:"Send Successfully"});

									}else
									{

									res.json({ status: statuscode.SUCCESS, amount: req.body.amount,msg:"Send Successfully" });
									}

								    });

									}

							});

						}else
						{
							res.json({ status: 500, data:errtoken});
						}

					});

   }else{

   	res.json({ status: 500, msg: 'user not exist' });
   }
  });




};
exports.sendmoneytowallet = async (req, res) => {
Card.findOne({ _id: req.body.cardid }, function(err, carddata) {
  if (carddata) {

		stripe.tokens.create(
		{
		card: {
		number: carddata.card_no,
		exp_month:carddata.exp_month,
		exp_year: carddata.exp_year,
		cvc: carddata.cvv,
		},

		},
		function(errtoken, token) {
			 User.findOne({ _id: req.body.user_id}, function(err, userexist) {
				 if(errors.indexOf(userexist)==-1){
          if(errors.indexOf(token)==-1){
			  
			
						stripe.customers.create(
						{
						'email' :userexist.email, // customer email id
						'source' : token.id, // stripe token generated by stripe.js
						'name' : 'harinder singh',
						'address' : {"city" :'khamano', "country" : "+1", "line1" : "khamano , rattom", "line2" : "khamano , ratton", "postal_code" :"12345", "state" : "fategarh sahib"}
						},
						function(errcustomer, customer) {
								if(errors.indexOf(customer)==-1){

								stripe.charges.create(
								{
								'currency' :'USD',
								'amount' :  Number(req.body.amount)*100,
								'description' : 'Paying to admin',
								'customer' : customer.id,

								},function(errcharge, charge) {
					                  if(errors.indexOf(charge)==-1){

										var add_payment = new Wallet({
										user_id : req.body.user_id,
										transaction_id :charge.id,
										amount: req.body.amount,
										status:1,

										});
										add_payment.save(function(err,qry){

										if(qry == null){
										res.json({ status: statuscode.SUCCESS, msg: err });
										}
										else{
										Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {
										if(walletdata.length>0)
										{
										Card.find({ user_id: req.body.user_id }, function(err, mycards) {
										if(mycards.length>0)
										{
										res.json({ status: statuscode.SUCCESS, msg: "Added to wallet Successfully!" ,data:mycards,wallet:walletdata});
										}	
										});
										}
										});
										}
										});
										}else{

											Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
											if(walletdata.length>0)
											{
											Card.find({ user_id: req.body.user_id }, function(err, mycards) {
											if(mycards.length>0)
											{
											res.json({ status: 500, msg: errcharge ,data:mycards,wallet:walletdata});
											}	
											});
											}
											});	    
											}

											});
										}else
										{

											Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
											if(walletdata.length>0)
											{
											Card.find({ user_id: req.body.user_id }, function(err, mycards) {
											if(mycards.length>0)
											{
											res.json({ status: 500, msg: errcustomer ,data:mycards,wallet:walletdata});
											}	
											});
											}
											});	  
										}
										});
										}else{

										Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {			
											if(walletdata.length>0)
											{
											Card.find({ user_id: req.body.user_id }, function(err, mycards) {
											if(mycards.length>0)
											{
											res.json({ status: 500, msg: errtoken ,data:mycards,wallet:walletdata});
											}	
											});
											}
										});

						}
				 }else
				 {
					 
					 
				 }
						
			 });

						});
						}else
						{
						res.json({ staus: statuscode.UNAUTHORIZED, msg: "Error occured", data: "" });
						}


});




};
exports.getmycards = async (req, res) => {
	try {
 // var new_favourite = new Card({
 //      user_id : req.body.user_id,
 //      card_name : 'demo',
 //      card_no: '4111111111111111',
 //      exp_month:'12',
 //      exp_year:'2025',
 //      cvv:'121',
 //    });
   
 //    new_favourite.save(function(err,qry){

 //    });
		Card.find({ user_id: req.body.user_id }, function(err, userdata) {
			if (userdata.length>0) {
				Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {
						if(walletdata.length>0){
						walletbankpayout.find({ user_id: req.body.user_id }, function(err, walletpayout) {
						if(walletpayout.length>0){
						res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!", data: userdata , wallet:walletdata ,walletpayout:walletpayout});
					}else
					{
res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!", data: userdata , wallet:walletdata,walletpayout:[] });
					}


					});
						}else
						{

						res.json({ status: statuscode.SUCCESS, msg: "Fetched Successfully!", data: userdata , wallet:[] });	
						}

			});
			} else {

					Wallet.find({ user_id: req.body.user_id }, function(err, walletdata) {
						

							walletbankpayout.find({ user_id: req.body.user_id }, function(err, walletpayout) {
				res.json({ status: statuscode.SUCCESS, msg: "Cards not exist", data: "",walletpayout:walletpayout,wallet:walletdata });

			});
		
		});
			}
		});
	} catch (e) {
		res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};


exports.getCountries = async ({ body }, res) => {
try {
let countries = csc.getAllCountries();
if (countries) {
res.json({ status: statuscode.SUCCESS, msg: "Countries Fetched Successfully!", data: countries });
} else {
res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! Unable to fetch!", data: "" });
}

} catch (e) {
res.json({ status: statuscode.SERVER_ERROR, msg: "Server error!" });
}
};



/************GET STATES************ */

exports.getStates = async ({ body }, res) => {
try {
let states = csc.getStatesOfCountry(body.country);

if (states) {
res.json({ status: statuscode.SUCCESS, msg: "States Fetched Successfully!", data: states });
} else {
res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! Unable to fetch!", data: "" });
}

} catch (e) {
res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
}
};

/************GET CITIES************ */

exports.getCities = async ({ body }, res) => {
  try {

    let cities = csc.getCitiesOfState(body.country, body.state);

      if (cities) {
        res.json({ status: statuscode.SUCCESS, msg: "Cities Fetched Successfully!", data: cities });
      } else {
        res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! Unable to fetch!", data: "" });
      }

  } catch (e) {
    res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
  }
};



/************CHANGE PASSWORD FROM PROFILE SETTINGS************ */

exports.changePassword = async ({ body }, res) => {
  try {
    User.findOne({ _id: body.user_id, email_verified: true }, function(err, userexist) {
      if (userexist) {
        const passwordmatch = bcrypt.compareSync(body.oldpassword, userexist.password);
        console.log(passwordmatch);
        if (passwordmatch) {
        console.log("entered update mode");
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(body.password, salt);
        console.log(hash);
        User.updateOne(
          { _id: body.user_id },
          {
            $set: {
              password: hash
            }
          },
          { new: true },
          function(err, updated) {
            console.log("yes");
            console.log(updated);
          }
        );
        res.json({
          error: null,
          status: statuscode.SUCCESS,
          msg: "Password has been updated!"
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


/************GET BY USERID************ */

exports.updateProfile = async ({ body }, res) => {
  try {
    User.findOne({ _id: body.user_id }, function(err, userdata) {
      if (userdata) {
        console.log('updating');
        User.updateOne(
          { _id: body.user_id },
          {
            $set: {
              first_name: body.firstName,
              last_name: body.lastName,
              phone: body.phone,
              country: body.country,
              state: body.state,
              country_iso: body.country_iso,
              state_iso: body.state_iso,
              city: body.city,
              street: body.street
            }
          },
          { new: true },
          function(err, updated) {
            console.log("yes");
            console.log(updated);
          }
        );
        res.json({
          error: null,
          status: statuscode.SUCCESS,
          msg: "Profile has been updated!",
        });

      } else {
        res.json({ staus: statuscode.UNAUTHORIZED, msg: "Sorry! No data found!", data: "" });
      }
    });
  } catch (e) {
    res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
  }
};

