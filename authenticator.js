var router = require('express').Router();
var Users = require('./users');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

//var jwt = require('jsonwebtoken');
var jwt = require('jwt-simple');

var logger = require('morgan');

var moment = require('moment');

var emailExistence = require('email-existence');

//var express  = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
router.use(bodyParser.json());

var connect = require('connect');
var fs = require('fs');
var path = require('path');
var app = require('./app');
var sendemail = require('./sendmail');
var Tokens = require('./token');

var async = require('async');

exports = mongoose.set('superSecret', 'password');




router.post('/authenticate/register', function(req, res){
    var userbody = req.body;
    var username = req.body.username;
    var email = req.body.email;

    console.log("router from authenticator.js");
    async.series([
    function(callback){
    checkIfUserEmail(username, email, function(err, username){
        if(err){
        return callback(err);
        }else{
        console.log("callback");
            callback();
        }
    });
},
//add all information given to new user.  Obtain id and email to send Email and associate token with user
function(callback){
    Users.addUsers(userbody, function(err, user){
    if(err){
        return callback(err);
        }
        else{
         sendemail.sendEmail(user.email, user._id, function(err, response){
         if(err){
                    Users.removeById(user._id);
                     return callback(err);
                 }   else{
                                     res.json({success : true, result : response});
                 }
                 });
    }
});
}
], function(err) {
             if(err) return res.json({success : false, result : err.toString()});
    }
  )
});


//check if new email
function checkIfUserEmail(username, email, callback){
    Users.findOneUsername(username, function(err, user){
        if(err){
          throw err;
        }
            if(!user){
                Users.findOneEmail(email, function(err, user){
                if(err) throw err;
                if(!user){
                    console.log("new user");
                    callback();
                }else{
                    return callback(new Error("E-mail already exists"));
                }
                });

                }else{
             return callback(new Error("Username already exists"));
            }

      });
      }




//register prototype
//open to deletion
router.post('/users', function(req, res){
        var user = req.body;
        var username = req.body.username;
        var email = req.body.email;
              Users.findOneUsername(username, function(err, user){
              if(err){
              throw err;
              }
              if(!user){
                      Users.findOneEmail(email, function(err, user){
                      if(err){
                        throw err;
                      }
                      if(!user){
                        Users.addUsers(user, function(err, user){
                                            if(err){
                                                throw err;
                                            }else{
                                            res.json({result : "message sent"});
                                        }
                                });
                            }else{
                            res.json({result : "email already exists"});
                            }
                        });
                      }else{
                    res.json({result: "username already exists"});
                    }
                });
           });







//route to authenticate a user )
router.post('/authenticate/login', function(req, res) {
  // find the user
    var username = req.body.username;
    console.log(username);


  Users.findOneUsername(username, function(err, user) {
    if (err) throw err;
    console.log(user);
    if(!user){
        res.json({success : false, result : 'That username does not exist'});
    }else{
    if(user.active){
    if (!user) {
      res.json({ success: false, result : 'Authentication failed. That username is not valid.'});
    } else {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, result : 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var expires = moment().add(7, 'days').valueOf();

        var token = jwt.encode({
        iss: user.id,
        exp: expires}, mongoose.get('superSecret'));

        //return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          expires: expires,
          token: token,
          username : user.username,
          email : user.email,
          chats : user.Chats.chat,
          room : user.Chats.room,
          from : user.Chats.from
        });
      }

    }

  }else{
    res.json({success : false, result : 'Please check your e-mail, or contact tech support.\nYour account is currently inactive'});
  }
}
  });
});

router.get('/authenticate/activate/:_id', function(req, res){
var id = req.params._id;

    Users.activateUser(id, function(err, message){
        if(err){
            throw err;
        }else{
            res.json(message);
        }
  });
});


router.post('/authenticate/resetPassword', function(req, res){
    var email = req.body.newEmail;
    var token = req.body.token;
    var username = req.body.username;

    async.series([
    function(callback){
    Tokens.checkToken(token, username, function(err, response){
    if(err){
        return callback(err);
    }else{
        callback();
    }
    });
    },
    function(callback){
    Users.findOneUsername(username, function(err, user){
    if(err) return callback(err);
    else{
    callback(null, user._id);
    }

    });
    },
    function(id, callback){
    sendemail.sendEmailToResetPassword(email, id, function(err, response){
        if(err){
        Users.removeById(user._id);
            return callback(err);
        }   else{
           res.json(response);
        }
        });
        }
        ],
        function(err){
            if(err) return res.json(err.toString());
            console.log("no error");
        });
});


//Write one for forgotten password

router.post('/authenticate/resetPasswordFromLoginScreen', function(req, res){
    var email = req.body.email;
    console.log(email);

    Users.findOneEmail(email, function(err, user){
    if(err) throw err;
    else{
        if(user == undefined){
          res.json({result : "That user does not exist"});
        }else{

sendemail.sendEmailToResetPassword(email, user._id, function(err, response){
        if(err){
            res.json({result : "The message was not sent. Please try again later."});
          }   else{
          res.json({result : "message sent"});

          }
        });
      }
    }
  });
});

router.get('/resetPassword/:id/:password', function(req, res){

    var id = req.params.id;
    var password = req.params.password;

    Users.getUsersById(id, function(err, user){
      if(err){
        res.send(err);
      }else{

        Users.updatePasswordById(id, password, function(req, response){
      if(err){
        res.send(err);
      }else{

          console.log(response);
          res.send(response);

      }
   });
      }
  });
});

router.post('/resetPasswordFormInfo', function(req, res){

console.log(req.body);
    var password = req.body.password;

    var id = req.body.id;
    console.log("id " + id);
    console.log("password " + password);



        Users.updatePasswordById(id, password, function(err, response){
          if(err){
        res.send({error : "Please try again"})
      }else{
        console.log(response);
            res.send({success : "password updated"});
        }
      });
});

router.get('/resetPasswordForm/:id', function(req, res){
console.log("resetPassword form");
var id = req.params.id;

    Users.getUsersById(id, function(err, user){
      if(err){
        res.send({result : "Please try again"})
      }else{
        console.log("resetPassword form " + user.username);

        res.sendFile('/Users/DarthCwompy/Documents/Node/resetPasswordForm.html');

    }
  });
});






module.exports = router;

















