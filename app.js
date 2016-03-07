/**
 * Module dependencies.
 */

//app.use(express.static(__dirname));


var GCM = require('./gcm');
var apikey = 'API_KEY'
//var gcmSender = new gcm.Sender(apikey);

var request = require('request');
var gcm = new GCM(apikey);


var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

server.listen(8080);

//var express  = require('express');
var connect = require('connect');
var pem = require('pem');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');




var https = require('https');

var fs = require('fs');
var path = require('path');
//var app  = express();

//var http = require('http').Server(app);

var authRoute = require('./authenticator');
var userRoute = require('./user_routes');
var Users = require('./users');

var db = mongoose.connect('mongodb://localhost/profiles');
//var io = require('socket.io')(http);


app.use('/', authRoute);
app.use('/', userRoute);


var port     = process.env.PORT || 8080;
// Configuration
app.use(logger("combined"));
app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(function(req, res){
   res.end(JSON.stringify(req.body));
  });




var pkey = fs.readFileSync(path.join(__dirname, '/ssl/37718250_localhost.key'));
var pcert = fs.readFileSync(path.join(__dirname, '/ssl/37718250_localhost.cert'));

var options = {
    key: pkey,
    cert: pcert
};


//var server = https.createServer(options, app);


server.listen(443);

//io.listen(http);
var connected_users = {};

io.sockets.on('connection', function (socket) {

console.log('connection made by ' + socket.id);


socket.on('addUser', function(newUser){

connected_users[newUser.username] = socket.id;

console.log("user Added" + connected_users[newUser.username]);

});


socket.on('disconnectUser', function(user){

console.log(user.username);
console.log(connected_users);
console.log("user still exists: " + connected_users[user.username]);
connected_users[user.username] = undefined;


console.log("user disconnected: " + connected_users[user.username]);



});


socket.on('getPastChats', function(username){
console.log("past chats");
Users.getChats(username.username, function(err, user){
        if(err){
        console.log("errrrrrr");
            throw err;
        }else{
            console.log("new username " + username.username);
            console.log("user arrays " + user);
            io.sockets.emit('chats', user);
        }
    });
});


socket.on('delete', function(popInfo){
console.log("delete called");

    Users.deleteRecord(popInfo.username, popInfo.popRecord, function(err, result){
    if(err){
    throw err;
    }else{

    console.log("result " + result);
        Users.deleteFrom(popInfo.username, popInfo.popFrom, function(err, result){
        if(err){
        throw err;
        }else{

        console.log("result " + result);

        }
        });
    }
    });
});


socket.on('join', function(chatmembers){
var username = chatmembers.username;
var otherUser = chatmembers.otherUser;
var room = username + "&" + otherUser;


console.log("joined", room);
socket.join(room);
    });

socket.on('send message', function(data){
    var from = data.username;
    var to = data.otherUser;
    var message = data.message;
    data.error = "false";

        console.log("socket " + connected_users[from]);
        console.log("username " + data.username);
        console.log("message " + data.message);
        console.log("otherUser " + data.otherUser);
        console.log("Error " + data.error);
    if(connected_users[to] == undefined){


    console.log("undefined user");
  console.log("to " + connected_users[to]);
  console.log("from " + connected_users[from]);
//Send to GCM for push notification

Users.findOneUsername(to, function(err, response){

 console.log("response " + response.GCM.RegID);

    if(err){
    throw err;
    }else{
     if(response != undefined){

     console.log("User is offline");
var msg = {
   registration_ids: [response.GCM.RegID], // this is the device token (phone)
   collapse_key: "your_collapse_key", // http://developer.android.com/guide/google/gcm/gcm.html#send-msg
   time_to_live: 180, // just 30 minutes
   data: {
    "message" : message, // your payload data
    "sender" : from
   }
 };


 // send the message and see what happened
 gcm.send(msg, function(err, response) {
  if(err){
  console.log(err);
    var room = from + "&" + to;

    data.error = "true";
  console.log("error " + data.error);
    io.sockets.in(room).emit('new message', data);
  }else{

  var failure = response.failure;
   // that error is from the http request, not gcm callback

   console.log(response); // http://developer.android.com/guide/google/gcm/gcm.html#response

     var room = from + "&" + to;

        if(failure == 1){
    data.error = "true";
    }
    console.log(data.error);
     io.sockets.in(room).emit('new message', data);
 }
 });


    }
    else{
     console.log("User has no RegID");
  }
  }
  });

    }else{

           console.log("to " + connected_users[to]);
           console.log("from " + connected_users[from]);

        var room1 = to + "&" + from;
        var room2 = from + "&" + to;

       io.sockets.in(room1).emit('new message', data);
       io.sockets.in(room2).emit('new message', data);
        }
 });

});



//app.listen(port);
console.log('The App runs on port ' + port);

module.exports = server;
module.exports = app;
