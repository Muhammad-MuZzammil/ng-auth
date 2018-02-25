var express = require('express');
var app = express();
var bodParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const path = require('path');

var config = require('./config');
var user = require('./routes/user.js');

var port = process.env.PORT || 8080;
mongoose.connect(config.database, function (err) {
  if (err) {
    console.log('Error connecting database, Please check if MongoDB is running')
  }
  else {
    console.log("Connected to database...");
  }
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type: '*/*' }));

// use morgan to log request to the console
app.use(morgan('dev'));

//Enable CORS from client-side
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST , PUT, PATCH, DELETE');
  // res.setHeader('Access-Control-Allow-Method', 'PUT,GET,POST,DELETE,OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Cridentials");
  res.setHeader("Access-Control-Allow-Cridentials", "true");
  next();
});

// basic routes

app.get('/', function (req, res) {
  res.send('Expense watch API is runnning at http://localhost:' + port);
});


app.post('/register', user.signup);

//express router
var apiRoutes = express.Router();

// initialize apiRoutes so our full path is http://localhost:port/api
app.use('/api', apiRoutes);

// login Route
apiRoutes.post('/login', user.login);


// kick off the server
app.listen(port);
console.log("Expense watch app is listening at http://localhost:" + port);
