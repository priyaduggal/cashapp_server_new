 var express = require("express"),
	app = express(),
	port = process.env.PORT || 3000,
	mongoose = require("mongoose"),
	users = require("./api/models/UserModel"),
	admin = require("./api/models/AdminModel"),
	card = require("./api/models/UserModel"),
	bodyParser = require("body-parser");
	// multer = require("multer");

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/'); // live
mongoose.connect("mongodb://localhost/cash", { useNewUrlParser: true, useUnifiedTopology: true }); // local
var path = __dirname;
// app.use("/images", express.static(path[0] + "/images"));


app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Auth_Token");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));
//app.use(bodyParser.json());
app.set("port", port);

var routes = require("./api/routes/routes");
routes(app);

app.listen(port);
module.exports = app;

console.log("server started on: " + port);
