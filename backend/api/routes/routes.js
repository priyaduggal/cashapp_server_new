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
app.route("/getByUserActid").post(users.getByUserActid);
app.route("/shareqr").post(users.shareqr);
app.route("/allusersphone").post(users.allusersphone);

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
	app.route("/usercreds").get(admin.usercreds);
	app.route("/getByAdminId").post(admin.getByAdminId);
	app.route("/matcholdPass").post(admin.matcholdPass);
	app.route("/recent_users").post(admin.recent_users);
	app.route("/admin_dashboard").post(admin.admin_dashboard);
	app.route("/check_admin_token").post(admin.check_admin_token);
	app.route("/getAdminDetails").post(admin.getAdminDetails);
	app.route("/getadminnotifications").post(admin.getadminnotifications);
	app.route("/sendtransactions").post(admin.sendtransactions);
	app.route("/receivetransactions").post(admin.receivetransactions);
	app.route("/updateAdminDetails").post(admin.updateAdminDetails);
	app.route("/ChangeStatusUser").post(admin.ChangeStatusUser);
	app.route("/transactiondetails").post(admin.transactiondetails);
	app.route("/deletetransaction").post(admin.deletetransaction);
	app.route("/user_stats").post(admin.user_stats1);
	app.route("/user_stats2").post(admin.user_stats2);
	app.route("/user_stats3").post(admin.user_stats3);
	app.route("/trans_stats").post(admin.trans_stats);
	app.route("/stripe_details").post(admin.stripe_details);
	app.route("/update_stripe").post(admin.update_stripe);
	app.route("/sumtransactions").post(admin.sumtransactions);
	app.route("/viewuser").post(admin.viewuser);
	app.route("/alluserswithproof").post(admin.alluserswithproof);
	app.route("/idproofstatus").post(admin.idproofstatus);
	

	
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
