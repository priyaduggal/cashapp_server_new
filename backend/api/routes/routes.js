"use strict";
module.exports = function(app) {
var users = require("../controllers/UsersCtrl");

app.route("/addUser").post(users.add_user);
// app.route("/resendotp").post(users.resendotp);
// app.route("/verifyotp").post(users.verifyotp);
app.route("/mailverification/:verificationLink").get(users.mailverification);
app.route("/forgotpassword").post(users.forgotpassword);
app.route("/reset/:token").get(users.reset).post(users.resetpass);
app.route("/login").post(users.login_user);
app.route("/getByUserId").post(users.getByUserId);
app.route("/getCountries").get(users.getCountries);
app.route("/getmycards").post(users.getmycards);
app.route("/sendmoneytowallet").post(users.sendmoneytowallet);
app.route("/sendmoneytobank").post(users.sendmoneytobank);
app.route("/getStates").post(users.getStates);
app.route("/stripe_redirect").get(users.stripe_redirect);
app.route("/allusers").post(users.allusers);
app.route("/getCities").post(users.getCities);
app.route("/changePassword").post(users.changePassword);
app.route("/updateProfile").post(users.updateProfile);
app.route("/uploadImage").post(users.uploadImage);
app.route("/uploadIdImage").post(users.uploadIdImage);
app.route("/deleteImage").post(users.deleteImage);
app.route("/sendrequest").post(users.sendrequest);
app.route("/getNotifications").post(users.getNotifications);
app.route("/rejectRequest").post(users.rejectRequest);
app.route("/approveRequest").post(users.approveRequest);
app.route("/getusertransactions").post(users.getusertransactions);
app.route("/getnotificationcount").post(users.getnotificationcount);
app.route("/payAmount").post(users.payAmount);
app.route("/getTransactiondetails").post(users.getTransactiondetails);
app.route("/searchusers").post(users.searchusers);
app.route("/getcardwithid").post(users.getcardwithid);
app.route("/addcard").post(users.addcard);
app.route("/getMycontacts").post(users.getMycontacts);
app.route("/editcard").post(users.editcard);
app.route("/deletecard").post(users.deletecard);
app.route("/contactAdmin").post(users.contactAdmin);
app.route("/setnotification").post(users.setnotification);

	// var category = require("../controllers/CategoriesCtrl");

	// app.route("/add_category").post(category.add_category);
	// app.route("/get_category").get(category.get_category);
	/***SUB CATEGORY*** */
	// app.route("/add_sub_category").post(category.add_sub_category);
	// app.route("/get_sub_category").post(category.get_sub_category);
	/***SAVE QA***/

	// app.route("/save_qa").post(category.save_qa);
	// app.route("/get_qa").post(category.get_qa);


	/******************ADMIN ROUTES**********************/

	var admin = require("../controllers/AdminCtrl");

	app.route("/loginAdmin").post(admin.login_admin);
	app.route("/usercreds").post(admin.usercreds);
	app.route("/getByAdminId").post(admin.getByAdminId);
	app.route("/matcholdPass").post(admin.matcholdPass);

	
	// app.route("/changePassword").post(admin.changePassword);
	// app.route("/updateProfile").post(admin.updateProfile);
	// app.route("/uploadImage").post(admin.uploadImage);







	// var category = require("../controllers/CategoriesCtrl");

	// app.route("/add_category").post(category.add_category);
	// app.route("/get_category").get(category.get_category);
	/***SUB CATEGORY*** */
	// app.route("/add_sub_category").post(category.add_sub_category);
	// app.route("/get_sub_category").post(category.get_sub_category);
	/***SAVE QA***/

	// app.route("/save_qa").post(category.save_qa);
	// app.route("/get_qa").post(category.get_qa);
};
