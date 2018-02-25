
var mongoose = require('mongoose');
var User = require('../models/user');
var jwt = require('jsonwebtoken')
var config = require('../config');

exports.signup = function (req, res, next) {
  // check for registration error

  const fullname = req.body.fullname;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!fullname || !email || !password || !confirmPassword) {
    return res.status(422).json({ success: false, message: 'Posted data is not correct or incomplete' });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ success: false, message: 'password and confirm password must be same' })
  }

  User.findOne({ email: email }, function (err, existingUser) {
    if (err) { res.status(400).json({ success: false, message: 'Error processing request' + err }) }

    // iff error is not unique return error
    if (existingUser) {
      return res.status(201).json({
        success: false,
        message: 'email already exist.'
      });
    }
    //if no error, create account
    let oUser = new User({
      fullname: fullname,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    })
    oUser.save(function (err, oUser) {
      if (err) { res.status(400).json({ success: false, message: 'Error Processing requeest' + err }) }
      res.status(201).json({
        success: true,
        message: 'User created successfully, Please login to access your account'
      });
    });
  });

}


exports.login = function (req, res, next) {
  // find the user
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Error processing request' + err
      })
    }
    if (!user) {
      res.status(201).json({
        success: false,
        message: 'Incorrect login credentials'
      })
    }
    else if (user) {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: config.tokenexp
          });
          // login success update last login
          user.lastlogin = new Date();

          user.save(function (err) {
            if (err) {
              res.status(400).json({ success: false, message: 'Error processing request' + err })
            }
            res.status(201).json({
              success: true,
              message: { 'userid': user._id, 'username': user.username, 'firstname': user.firstname, 'lastlogin': user.lastlogin },
              token: token
            })
          })
        }
        else {
          res.status(201).json({
            success: false,
            message: 'Incorrect login credentials'
          });
        }
      })

    }
  })
}
exports.authenticate = function (req, res, next) {
  // check header or url parametersor post parameters for token
  var token = req.body.token || req.query.token || req.headers['authorization'];
  // console.log(token);
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        return res.status(201).json({
          success: false,
          message: 'Authenticate token expired, please login again', errcode: 'exp-token'
        });
      }
      else {
        req.decoded = decoded;
        next();
      }
    })
  }
  else {
    res.status(201).json({
      success: false,
      message: 'fatal error, Authenticate token not available',
      errcode: 'no-token'
    });
  }
}



