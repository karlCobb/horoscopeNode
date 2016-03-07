var mongoose = require('mongoose');
var connect = require('connect');

var db = mongoose.connect('mongodb://localhost/profiles');
module.exports.db = db;