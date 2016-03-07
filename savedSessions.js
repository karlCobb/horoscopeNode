var mongoose = require('mongoose');



var sessionSchema = mongoose.Schema({
        "username" : String,
        "sessionKey" : String
});

var Session = mongoose.model('Session', sessionSchema);

exports = Session;

module.exports.saveSession = function(username, sessionKey, callback){
    Session.create({'username' : username, 'sessionKey' : sessionKey}, callback);
}

module.exports.verifySession = function(sessionKey, callback){
    Session.findOne({'sessionKey' : sessionKey}, callback);
}

module.exports.removeSession = function(sessionKey, callback){
    Session.remove({'sessionKey' : sessionKey}, callback);
}