var router = require('express').Router();
var Users = require('./users');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var jwt = require('jsonwebtoken');
var logger = require('morgan');
var bodyParser = require('body-parser');


var path = require('path');
var mongoose = require('mongoose');
router.use(bodyParser.json());
var connect = require('connect');
var fs = require('fs');
var path = require('path');
var app = require('./app');

var async = require('async');
var sendemail = require('./sendmail');
var secret = require('./authenticator');

var path = require('path');

var unirest = require('unirest');

var Tokens = require('./token');

var exif = require('exif').ExifImage;

var multer = require('multer');

var storage = multer.diskStorage({





  destination: function (req, file, cb) {
  console.log("destination updateImage")
    cb(null,  '/Users/DarthCwompy/Documents/Node/photos/')
  },
  filename: function (req, file, cb) {
console.log("filename updateImage")
console.log(req.body.username);
    cb(null, req.body.username + '-' + Date.now())
  }
});


var upload = multer({ storage: storage });




router.use(bodyParser.urlencoded({limit: 1024 * 5, extended: true}));

router.use(bodyParser.json({limit: 1024 * 5, extended: true}));
//return all users
router.get('/users', function(req, res){
console.log("hello from user_routes");
Users.getUsers(function(err, users){
    if(err){
        throw err;
    }else{
    res.json(users);
    }
});
});




router.post('/users/downloadImage/', function(req, res){
    var username = req.body.username;
    Users.findOneUsername(username, function(err, user){
    if(err) throw err;
    else{
    console.log("downloaded image" + user.image);
    if(user.image != undefined){
             res.sendFile(user.image);
           }
    }
});
});

router.post('/users/updateImage/',  upload.single('image'), function (req, res) {
console.log("router.post updateImage")
console.log(req.file);
console.log("username" + req.body.username);
var filename = req.file.filename;
var rotate = req.body.rotate;
var token = req.body.token;
console.log(RegID);


Tokens.checkToken(token, username, function(err, response){
    if(err){
    res.json(err.toString());
    }else{
    console.log("token is fine");

Users.updateImage(req.body.username, filename, rotate,  function(err, response){
    if(err){ throw err;
    }else{
    res.json(response);
      }

        });
      }
    });
});



router.get('/', function(req, res){
console.log('find socket');
  res.sendFile(path.join(__dirname, '/chat.html'));

});





router.post('/users/updateAbout/',  function (req, res) {
var username = req.body.username;
var about = req.body.about;
var token = req.body.token;


Tokens.checkToken(token, username, function(err, response){
    if(err){
    res.json(err.toString());
    }else{
    console.log("token is fine");
Users.updateAbout(username, about,  function(err, response){
    if(err) throw err;
    else{
    res.json(response);
        }

      });
    }
  });
});

router.post('/users/updateRegID/', function(req, res){
var username = req.body.username;
var RegID = req.body.RegID;

Users.updateRegID(username, RegID, function(err, response){
if(err){
throw err;
}else{
console.log(response);
    res.json(response);
}

    });
});


//return user by id
router.get('/users/:_id', function(req, res){
Users.getUsersById(req.params._id, function(err, users){
    if(err){
        throw err;
    }else{
         res.json(users);
         }

});
});


router.post('/users/addContact', function(req, res){
var username = req.body.username;
var contactToAdd = req.body.contact;


Users.addContact(username, contactToAdd, function(err, response){
if(err){
console.log(err);
}else{
res.send(response);
}


    });
});


router.post('/users/removeContact', function(req, res){
var username = req.body.username;
var contactToRemove = req.body.contact;


Users.removeContact(username, contactToRemove, function(err, response){
if(err){
console.log(err);
}else{
res.send(response);
}


});


});





router.post('/users/updateBirthdayInfo/', function(req, res){
//:year/:month/:day/:hour/:minute/:longitude/:latitude/:sun/:mercury/:venus/:moon/:mars/:jupiter/:saturn/:uranus/:neptune/:ascendent/:token/:username',

var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];
var username = req.body.username;
var year = req.body.year;
var month = req.body.month;
var day = req.body.day;
var hour = req.body.hour;
var minute = req.body.minute;
var latitude = req.body.latitude;
var longitude = req.body.longitude;
var sun = req.body.sun;
var mercury = req.body.mercury;
var venus = req.body.venus;
var moon = req.body.moon;
var mars = req.body.mars;
var jupiter = req.body.jupiter;
var saturn = req.body.saturn;
var uranus = req.body.uranus;
var neptune = req.body.neptune;
var ascendent = req.body.ascendent;
var sunHour = req.body.sunHour;
var sunMinute = req.body.sunMinute;

var sunsign = req.body.sunSign;
var mercurysign = req.body.mercurySign;
var venussign = req.body.venusSign;
var moonsign = req.body.moonSign;
var marssign = req.body.marsSign;
var jupitersign = req.body.jupiterSign;
var saturnsign = req.body.saturnSign;
var uranussign = req.body.uranusSign;
var neptunesign = req.body.neptuneSign;
var ascendentsign = req.body.ascendentSign;



Tokens.checkToken(token, username, function(err, response){
    if(err){
    res.json(err.toString());
    }else{
    console.log("token is fine");
    Users.updateBirthdayInfo(username, year, month, day, hour, minute, latitude, longitude,
    sun, mercury, venus, moon, mars, jupiter, saturn, uranus, neptune, ascendent,
    sunHour, sunMinute, sunsign, mercurysign, venussign, moonsign, marssign, jupitersign, saturnsign, uranussign, neptunesign, ascendentsign, function(err, user){
        if(err){
        res.json(err.toString());
        }else{
        console.log(user);
        res.json(user);
        }

    });
  }
});


});

router.post('/users/updateUsername', function(req, res){
/*
Check token section
*/
    var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-access-token'];
    var oldUsername = req.body.username;
    var newUsername = req.body.newUsername;

console.log("users updateUsername");
async.series([
function(callback){
Users.findOneUsername(oldUsername, function(err, user){
if(err)
return callback(err);
if(!user){
console.log("no user");
callback(new Error("That user does not exist"));
}else{
callback();
}
});
},
function(callback) {
Tokens.checkToken(token, oldUsername, function(err, response){
    if(err){
    return callback(err);
    }else{
    console.log("token is fine");
    callback();
  }
});
},
function(callback) {
Users.findOneUsername(newUsername, function(err, user){
    if(err){
    return callback(err);
    }
    if(!user){
        Users.updateUsername(oldUsername, newUsername, function(err, user){
        if(err){
           return callback(err);
            }else{
                console.log(user);
                 res.json(user);
                callback();
            }
         });
    }else{
        return callback(new Error("That username already exists"));
          }
       });
     }
  ], function(err) {
            if(err) return res.end(err.toString());
    })
});







 router.post('/users/updateEmail', function(req, res){
     var oldEmail = req.body.email;
     var newEmail = req.body.newEmail;
     var username = req.body.username;
     var token = req.body.token;
     console.log(newEmail);
async.waterfall([
function(callback) {
Tokens.checkToken(token, username, function(err, response){
    if(err){
    return callback(err);
    }else{
    console.log("token is fine");
    callback();
  }
});
},
function(callback){
Users.findOneEmail(oldEmail, function(err, user){
    if(err) return callback(err);
    else if(!user){
    res.end("That is not a current email");
    }
    else{
    callback(null, user._id);
    }
});
},
function(id, callback){
 Users.findOneEmail(newEmail, function(err, user){
    if(!user){
         Users.updateEmail(oldEmail, newEmail, function(err, user){
         if(err){
            return callback(err);
             }else{
             console.log(user);
             sendemail.sendEmail(newEmail, id, function(err, response){
            if(err){
                Users.removeById(id);
                return callback(err);
            }else{
              res.json(response);
            }
         });
       }
     });
     }else{
         res.end("That e-mail already exists");
     }
  });
  }],function(err){
    if(err) res.end(err.toString());

  }
  )
});


router.post('/users/updateselected', function(req, res){
        var oldUsername = req.body.username;
        var oldEmail = req.body.email;
        var newUsername = req.body.newUsername;
        var newEmail = req.body.newEmail;

        Users.updateSelected(oldUsername, newUsername, oldEmail, newEmail, function(err, user){
        if(err){
            throw err;
        }else{
                res.json(user);
            }
        });
});

router.get('/users/searchUsers/:ageLow/:ageHigh/:sunSign/:gender/:minlat/:minlng/:maxlat/:maxlng', function(req, res){
var minlng = req.params.minlng;
var maxlng = req.params.maxlng;
var minlat = req.params.minlat;
var maxlat = req.params.maxlat;

var ageLow = req.params.ageLow;
var ageHigh = req.params.ageHigh;
var sunSign = req.params.sunSign;
var gender = req.params.gender;

console.log(ageLow);

console.log(ageHigh);

console.log(sunSign);

console.log(gender);
Users.searchUsers(ageLow, ageHigh, sunSign, gender, minlat, minlng, maxlat, maxlng, function(err, users){
        if(err){
            throw err;
            console.log(err);
        }else{
        console.log(users);
            res.send(users);
        }
    });
});


router.get('/users/retrieveuser/:token/:username', function(req, res){
    var username = req.params.username;
    var token = req.params.token;
Tokens.checkToken(token, username, function(err, response){

    if(err){
    res.json(err.toString());
    }else{


    Users.findOneUsername(username, function(err, user){
        if(err){
        throw err
        }else{
        if(user){
        console.log(user);
        res.json(user);
        }else{
            var payload = new Users;
            console.log(payload);
            res.json(payload);
                }
            }
        });

    }
    });
});


module.exports = router;






