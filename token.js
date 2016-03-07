var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var connect = require('connect');
var fs = require('fs');
var path = require('path');
var app = require('./app');
var moment = require('moment');

var express  = require('express');

var async = require('async');
var secret = require('./authenticator');
var Users = require('./users');

module.exports.checkToken = function(token, username, next){
    console.log("checkToken");
async.waterfall([
    function(callback){
    if(token){
    try {
        var decoded = jwt.decode(token, 'password');

      } catch (err) {
        return next(new Error("Invalid token"));
      }
    }
    else{
    return next(new Error("There is no token"));
    }
    callback(null, decoded);
},
function(decoded, callback){
if(decoded){
console.log(decoded);
  console.log(decoded.iss);
  Users.getUsersById(decoded.iss, function(err, user){
  if(err || !user){
  return callback(err);
  }else{
   var checkUser = user.username;
   return callback(null, checkUser, decoded);
  }
  });
  }else{
  return next(new Error("Token is invalid"));
  }
},
function(checkUser, decoded, callback){
    console.log(checkUser);
    console.log(username);
  if(checkUser == username){
  console.log(decoded);
  callback(null, decoded);
  }else{
       return next(new Error("Please login again.  Wrong token."));
   }
   },
  function(decoded, callback){
  console.log("last function" + decoded.exp);
  console.log(Date.now());
if (decoded.exp <= Date.now()) {
  return next(new Error("Access token has expired"));
}else{
console.log("everything working");
   next();
}
}
],
function(err){
    if(err) return next(err);
    console.log("no error");
});
}