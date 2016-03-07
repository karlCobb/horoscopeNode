var Users = require('./users');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var jwt = require('jwt-simple');



var logger = require('morgan');

var moment = require('moment');

var emailExistence = require('email-existence');

//var express  = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var connect = require('connect');
var fs = require('fs');
var path = require('path');
var app = require('./app');
var Tokens = require('./token');

var async = require('async');




/*
Send Email to verify email for a new user or a change of email
*/



module.exports.sendEmail = function(email, id, callback){
console.log(email);


var smtpTransport = nodemailer.createTransport("SMTP", {
   host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
         service: "Gmail",
     auth : {
         user: "don.dorko@gmail.com",
         pass: "xxxxxxx"
     }
});

  var expires = moment().add(7, 'days').valueOf();

        var token = jwt.encode({
        iss: id,
        exp: expires}, mongoose.get('superSecret'));

              var host= '192.168.43.62:8080';
              var link="http://" + host + "/authenticate/activate/" + id;
              var mailOptions = {
                       from : 'don.dorko@gmail.com',
                       to : email,
                       subject : "Please confirm your Email account",
                       html : "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
                   }
       console.log(email);
       smtpTransport.sendMail(mailOptions, function(err, response){
         console.log(mailOptions);
      if(err){
         console.log(err);
      }else{
         callback(null, "message sent");
          }
  smtpTransport.close();
    });
}



module.exports.sendEmailToResetPassword = function(email, id, callback){
console.log(email);


var smtpTransport = nodemailer.createTransport("SMTP", {
   host: "smtp.gmail.com", // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
         service: "Gmail",
     auth : {
         user: "don.dorko@gmail.com",
         pass: "xxxxxxxxx"
     }
});

        var expires = moment().add(7, 'days').valueOf();

        var token = jwt.encode({
        iss: id,
        exp: expires}, mongoose.get('superSecret'));


              var host= '/localhost:8080';
              var link="http://" + host + "/resetPassword?id=" + id;
              var mailOptions = {
                       from : 'don.dorko@gmail.com',
                       to : email,
                       subject : "Please confirm your Email account",
                       html : "Hello,<br> Please Click on the link to reset your password.<br><a href=" + link + ">Click here to verify</a>"
                       }
       console.log(email);
       smtpTransport.sendMail(mailOptions, function(err, response){
         console.log(mailOptions);
      if(err){
         callback(err);
      }else{
      callback(null, "message sent");
        smtpTransport.close();
          }

    });
}









