var express  = require('express');
var connect = require('connect');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
var app  = express();

// Configuration
app.use(logger("combined"));
app.use(bodyParser.urlencoded({
      extended: true
  }))
  app.use('/', router);
  app.use(bodyParser.json())
  app.use(function(req, res){
   res.end(JSON.stringify(req.body));
  })


router.post('/profiles/:username/:email/:password', function(req, res){
    var username = req.params.username;
    var email = req.params.email;
    var password = req.params.email;

    if(username && email && password){
        var newUser = new users;
        users.username = username;
        users.email = email;
        users.password = password;
       users.save(function(err, savedObject){

    if(err){
    console.log(err);
    res.status(500).send();
    }else{
    res.send(savedObject);

    }
    });
}
});

router.get('/profiles', function(req, res){
var responseString = "OK";
res.send(responseString);

});
