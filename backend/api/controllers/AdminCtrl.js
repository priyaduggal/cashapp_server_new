"use strict";

var mongoose = require("mongoose"),
	Admin = mongoose.model("admin"),
	// Card = mongoose.model("card"),
	path = require("path"),
	transaction = mongoose.model("transaction"),
	User = mongoose.model("user"),
	notifications = mongoose.model("notifications"),
	stripesettings = mongoose.model("stripesettings"),
	fs = require("fs"),
  multer = require("multer");
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


exports.login_admin = async ({ body }, res) => {

	try {
		Admin.findOne({ email: body.email }, function(err, userexist) {
			if (userexist) {
				const passwordmatch = bcrypt.compareSync(body.password, userexist.password);
				console.log(passwordmatch);
				if (passwordmatch) {
					res.json({ status: 200, msg: "Login Successfully!", data: userexist });
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

exports.viewuser = async ({ body }, res) => {
	var uid = body.id;

						 var conditions = {};
						conditions['$or'] = [ 
						      {from_id : { '$regex' :uid, '$options' : 'i' }},
						      {to_id : { '$regex' : uid, '$options' : 'i' }} 
						    ];

								User.findOne({_id:body.id}, function(err, userexist) {

                  	transaction.find(conditions, function(err, userexist) {
											
	if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.from_id }, function(err, user) {
                  		User.findOne({ _id: notification.to_id }, function(err, touser) {
 												if(errors.indexOf(user) == -1){
														dict = {
														notification :notification,
														amount:notification.amount,
														tid:notification._id,
														fromuser : user.first_name+' '+user.last_name,
														touser:touser.first_name+' '+touser.last_name,
														created_at:notification.created_at,
														medium:notification.medium,
														};
														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS,msg: "Fetched Successfully!",
															data: arraySort(all_notifications, 'created_at', {reverse: true}) });
													}}
												});
                  	});
				  });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found" ,data:[]});
				}



                  	});

                  });



};
exports.sumtransactions = async ({ body }, res) => {
transaction.find({}, function(err, userexist) {
if(userexist.length>0){
    var counter = 0,all_notifications = [],uid = '', dict = {};
    var sum=0;
      userexist.forEach(function(notification){

        sum=parseInt(sum) + parseInt(notification.amount);
			
			counter = counter + 1;
			

      if(counter == userexist.length){

									console.log(sum);
              		res.json({ status: statuscode.SUCCESS,msg:sum,data: sum});
      

	    }

	  });
}else{

	res.json({ status: statuscode.SUCCESS,msg: 0,data: 0});

}
    });
};
exports.update_stripe = async ({ body }, res) => {
console.log(body);
  stripesettings.updateOne(
          { _id: body.id


           },
          {
            $set: {
             mode:body.mode,
             test_pub_key:body.test_pub_key,
             test_secret_key:body.test_secret_key,
             live_secret_key:body.live_secret_key,
             live_pub_key:body.live_pub_key,
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

};
exports.stripe_details = async ({ body }, res) => {

stripesettings.findOne({}, function(err, stripe) {
 
 res.json({ status:1, data:stripe});

  });

};
exports.alluserswithproof = async ({ body }, res) => {
try {
    User.find({ id_proof : {$nin : errors}}, function(err, userdata) {
      res.json({ status:200, data: userdata });
    });
  } catch (e) {
    res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
  }
};
exports.deletetransaction = async ({ body }, res) => {
try {
    transaction.remove({ _id: body.id }, function(err, userdata) {
      res.json({ status:1, msg: "Deleted successfully" });
    });
  } catch (e) {
    res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
  }


};
exports.idproofstatus = async ({ body }, res) => {

try {
    User.findOne({ _id: body.id }, function(err, userdata) {
      if (userdata) {
        console.log('updating');
        User.updateOne(
          { _id: body.id },
          {
            $set: {
              id_proof_status: body.status,
            
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
          status: 1,
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
exports.ChangeStatusUser = async ({ body }, res) => {
try {
    User.findOne({ _id: body.id }, function(err, userdata) {
      if (userdata) {
        console.log('updating');
        User.updateOne(
          { _id: body.id },
          {
            $set: {
              status: body.status,
            
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
          status: 1,
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
exports.updateAdminDetails = async ({ body }, res) => {
 console.log(body);
 try {
    Admin.findOne({ _id: body.id }, function(err, userdata) {
      if (userdata) {
        console.log('updating');
        Admin.updateOne(
          { _id: body.id },
          {
            $set: {
              name: body.first_name,
              phone: body.phone,
              email: body.email,
              address: body.address,
            }
          },
          { new: true },
          function(err, updated) {
            console.log("yes");
            console.log(updated);

            if(errors.indexOf(body.password)==-1)
            {
             console.log('changingpassword');	
						var salt = bcrypt.genSaltSync(10);
						var hash = bcrypt.hashSync(body.password, salt);
						Admin.updateOne(
						{ _id: body.id },
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
						

            }

          }
        );
        res.json({
          error: null,
          status: 1,
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



exports.getadminnotifications = async ({ body }, res) => {

	notifications.find({},null,{sort: {'created_at': -1}}, 
		function(err, userexist) {
			if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.from_id }, function(err, user) {
 												if(errors.indexOf(user) == -1){
														dict = {
														notification :notification,
														user : user.first_name,
														created_at:notification.created_at,
														};
														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS,
														 msg: "Fetched Successfully!",
														 data: arraySort(all_notifications, 'created_at', {reverse: true}) });
														}
 												}
                  	});
				  });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found" ,data:[]});
				}
		});

};
exports.getAdminDetails = async ({ body }, res) => {
try {
			Admin.findOne({_id:body.id}, function(err, userexist) {
			if (userexist) {

			res.json({ status: 1, data:userexist});
			}else
			{
			res.json({ status: 0, msg: "Server Error!" });

			}
			});

			} catch (e) {
			res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};
exports.check_admin_token = async ({ body }, res) => {
try {
			Admin.findOne({_id:body.userId}, function(err, userexist) {
			if (userexist) {

			res.json({ status: 1, data:userexist});
			}else
			{
			res.json({ status: 0, msg: "Server Error!" });

			}
			});

			} catch (e) {
			res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};
exports.recent_users = async ({ body }, res) => {
	try {
			User.find({},null,{ limit: 5, sort: {'created_at': -1}}, function(err, userexist) {
			if (userexist) {

			res.json({ status: 200, data:userexist});
			}else
			{
			res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });

			}
			});

			} catch (e) {
			res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });
	}
};


exports.trans_stats = async ({ body }, res) => {
var year=new Date().getFullYear();
var start = new Date(year, body.id, 1);
var end = new Date(year, body.id, 31);


// transaction.aggregate(
//    [
//      {


// 				 "$group":
// 				{
		
// 				"totalAmount": { "$sum": "$amount" },  //$first accumulator
// 				"count": { "$sum": 1 },  //$sum accumulator
			
// 				}
				

//        // $group:
//        //   {
//        //     created_at: {$gte: start, $lt: end},
//        //      totalAmount: { $sum: "$amount" },
//        //        count: { $sum: 1 }
//        //   }
//      }
//    ]
// )
// .then(res => console.log(res));



	transaction.find({created_at: {$gte: start, $lt: end}}, function(err, userexist) {
if(userexist.length>0){
    var counter = 0,all_notifications = [],uid = '', dict = {};
    var sum=0;
      userexist.forEach(function(notification){

        sum=parseInt(sum) + parseInt(notification.amount);
			
			counter = counter + 1;
			

      if(counter == userexist.length){

									console.log(sum);
              		res.json({ status: statuscode.SUCCESS,msg:sum,data: sum});
      

	    }

	  });
}else{

	res.json({ status: statuscode.SUCCESS,msg: 0,data: 0});

}
    });



};
exports.user_stats1 = async ({ body }, res) => {
var year=new Date().getFullYear();
var start = new Date(year, body.id, 1);
var end = new Date(year, body.id, 31);

	User.count({created_at: {$gte: start, $lt: end}}, function(err, userexist) {


      res.json({ status: statuscode.SERVER_ERROR, msg:userexist });

	});



};
exports.user_stats3 = async ({ body }, res) => {
var start = new Date(2021, 3, 1);
var end = new Date(2021, 3, 31);
	User.count({created_at: {$gte: start, $lt: end}}, function(err, userexist) {


      res.json({ status: statuscode.SERVER_ERROR, msg:userexist });

	});



};
exports.user_stats2 = async ({ body }, res) => {
var start = new Date(2021, 2, 1);
var end = new Date(2021, 2, 31);
	User.count({created_at: {$gte: start, $lt: end}}, function(err, userexist) {


      res.json({ status: statuscode.SERVER_ERROR, msg:userexist });

	});



};
exports.admin_dashboard = async ({ body }, res) => {
	
			User.count({}, function(err, userexist) {

				User.count({status:2}, function(err, blocked) {

				res.json({ status: 200, user: userexist, block:blocked });


			});
			});
			
};

exports.transactiondetails = async ({ body }, res) => {
	transaction.findOne({_id:body.id}, 
		function(err, userexist) {
				User.findOne({ _id: userexist.from_id }, function(err, fromuser) {

					User.findOne({ _id: userexist.to_id }, function(err, touser) {
				 res.json({ status: 200, trnsaction: userexist,from:fromuser,to:touser});

				});

				});
		});
};
exports.receivetransactions = async ({ body }, res) => {
transaction.find({action:2},null,{sort: {'created_at': -1}}, 
		function(err, userexist) {
			if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.to_id }, function(err, user) {
                  		User.findOne({ _id: notification.from_id }, function(err, touser) {
 												if(errors.indexOf(user) == -1){
														dict = {
														notification :notification,
														user : user.first_name,
														touser:touser.first_name,
														created_at:notification.created_at,
														};
														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS,msg: "Fetched Successfully!",
															data: arraySort(all_notifications, 'created_at', {reverse: true}) });
													}}
												});
                  	});
				  });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found" ,data:[]});
				}
		});

};
exports.sendtransactions = async ({ body }, res) => {
transaction.find({},null,{sort: {'created_at': -1}}, 
		function(err, userexist) {
			if (userexist.length>0) {
				  var counter = 0,all_notifications = [],uid = '', dict = {};
				  userexist.forEach(function(notification){
                  uid = notification.from_id;
                  	User.findOne({ _id: notification.from_id }, function(err, user) {
                  		User.findOne({ _id: notification.to_id }, function(err, touser) {
 												if(errors.indexOf(user) == -1){
														dict = {
														notification :notification,
														_id:notification._id,
														amount:notification.amount,
														medium:notification.medium,

														user : user.first_name,
														touser:touser.first_name,
														created_at:notification.created_at,
														};
														counter = counter + 1;
														all_notifications.push(dict);
														if(counter == userexist.length){
														res.json({ status: statuscode.SUCCESS,msg: "Fetched Successfully!",
															data: arraySort(all_notifications, 'created_at', {reverse: true}) });
													}}
												});
                  	});
				  });
				} else {
					res.json({ status: statuscode.UNAUTHORIZED, msg: "No records found" ,data:[]});
				}
		});
};

exports.usercreds = async ({ body }, res) => {

	res.json({ status: statuscode.SERVER_ERROR, msg: "Server Error!" });

	console.log('in credew');
		
};