var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    'username' : String,
    'email' : String,
    'password' : String,
    'active' : {type : Boolean, default : false},
    'about' : String,
    'image' : String,
    'socketID' : String,
    'age' : Number,
    'sex' : String,
    'orientation' : String,
    'contacts' : String,

    'GCM' : {
    'RegID' : String,
    },

    'Chats' : {
    'chat' : String,
    'room' : String,
    'from' : String
    },
    'BirthInfo' :
    {
     'Time' :
  //month is equal to month - 1;
    {
    'year' : String,
    'month' : String,
    'day' : String,
    'hour' : String,
    'minute' : String,
    'sunHour' : String,
    'sunMinute' : String
    },

    'Location' :
    {
    'latitude' : String,
    'longitude' : String
    },
    'PlanetPosition' : {
    'sun' : String,
    'mercury' : String,
    'venus' : String,
    'moon' : String,
    'mars': String,
    'jupiter': String,
    'saturn' : String,
    'uranus': String,
    'neptune': String,
    'ascendent' : String,
    },
    'Horoscope' : {
        'sunsign' : String,
        'mercurysign' : String,
        'venussign' : String,
        'moonsign' : String,
        'marssign': String,
        'jupitersign': String,
        'saturnsign' : String,
        'uranussign': String,
        'neptunesign': String,
        'ascendentsign' : String,
    }
    }

});

function getNumber(num){
    return (num/100).toFixed(2);
}

function setNumber(num){
    return num*100;
}




userSchema.path('email').index({unique : true});

var Users = mongoose.model('users', userSchema);


/*
Get Users
*/

exports = Users;
module.exports.getUsers = function(callback, limit){
    Users.find(callback).limit(limit);
}


module.exports.findRegID = function(username, callback){
    console.log("Find RegID" + username);
    Users.find({"username" : username}, {"GCM.RegID" : 1}, callback);
}

module.exports.getUsersById = function(id, callback){
    Users.findById(id, callback);
}

module.exports.findOneUsername = function(username, callback){
    Users.findOne({"username" : username}, callback);
}

module.exports.findOneEmail = function(email, callback){
    Users.findOne({"email" : email}, callback);
}

module.exports.searchUsers = function(ageLow, ageHigh, sunSign, gender, minlat, minlng, maxlat, maxlng, callback){
    Users.find({"sex" : gender, "BirthInfo.Horoscope.sunsign" : sunSign,  "age" : {$gte : ageLow}, 
        "age" : {$lte : ageHigh}, "BirthInfo.Location.latitude" : {$gte : minlat}, 
         "BirthInfo.Location.longitude" : {$gte : minlng},
          "BirthInfo.Location.latitude" : {$lte : maxlat}, 
           "BirthInfo.Location.longitude" : {$lte : maxlng}}, callback);
}

module.exports.updateChats = function(from, to, chat, callback){
    Users.update({"username" : to}, {$push : {"Chats.chat" : chat, "Chats.from" : from}}, callback);
}

module.exports.getChats = function(username, callback){
    Users.find({"username" : username}, {"Chats.chat" : 1, "Chats.from" : 1, "Chats.room" : 1}, callback);
}

module.exports.removeChats = function(username, callback){
    Users.update({"username" : username}, {"Chats.chat" : {}, "Chats.from" : {}, "Chats.room" : {}}, callback);
}


module.exports.addContact= function(username, contact, callback){
    Users.update({"username" : username}, {$push : {"contact" : contact}}, callback);
}

module.exports.removeContact= function(username, contact, callback){
    Users.update({"username" : username}, {$pop : {"contact" : contact}}, callback);
}





/*
Add User
*/



module.exports.addUsers = function(user, callback){
    Users.create(user, callback);
}

module.exports.activateUser = function(id, callback){
    Users.update({"_id": id}, {"active" : true}, callback);
}




/*
Update user info
*/


module.exports.updateRegID = function(username, RegID, callback){
    Users.update({"username" : username}, {$set : {"GCM.RegID" : RegID}}, callback);
}

module.exports.updateImage = function(username, filename, rotate, callback){
    Users.update({"username" : username}, {"image" : "/Users/DarthCwompy/Documents/Node/photos/" + filename, "rotate" : rotate}, callback);
}

module.exports.updateUsername = function(oldUsername, newUsername, callback){
        Users.update({"username" : oldUsername}, {"username" : newUsername}, callback);
    }


module.exports.updateEmail = function(oldEmail, newEmail, callback){
        Users.update({"email" : oldEmail}, {"email" : newEmail}, callback);
    //send verification to new email

    }

module.exports.updatePassword = function(username, password, callback){
        Users.update({"username" : username}, {"password" : password}, callback);
        //send an e-mail to reset password
    }

module.exports.updatePasswordById = function(id, password, callback){
        Users.update({"_id" : id}, {"password" : password}, callback);
        //send an e-mail to reset password
    }


module.exports.updateBirthday = function(username, birthday, callback){
    Users.update({"username" : username}, {"birthday" : birthday}, callback);
}

module.exports.updateAbout = function(username, about, callback){
    Users.update({"username" : username}, {"about" : about}, callback);
}

module.exports.updateBirthdayInfo = function(username, year, month, day, hour, minute, longitude, latitude,
sun, mercury, venus, moon, mars, jupiter, saturn, uranus, neptune, ascendent, sunHour, sunMinute,
sunsign, mercurysign, venussign, moonsign, marssign, jupitersign, saturnsign, uranussign, neptunesign, ascendentsign,
callback){
    Users.update({"username" : username}, {"BirthInfo" : {"Time" : {"year" : year, "month" : month, "day" : day, "hour" : hour, "minute" : minute, "sunHour" : sunHour,
    "sunMinute" : sunMinute},
    "Location" : {"latitude" : latitude, "longitude" : longitude},
    "PlanetPosition" : {"sun" : sun, "mercury" : mercury, "venus" : venus, "moon" : moon,
    "mars" : mars, "jupiter" : jupiter, "saturn" : saturn, "uranus" : uranus, "neptune" : neptune, "ascendent" : ascendent},
    "Horoscope" : {"sunsign" : sunsign, "mercurysign" : mercurysign, "venussign" : venussign, "moonsign" : moonsign, "marssign" : marssign,
    "jupitersign" : jupitersign, "saturnsign" : saturnsign, "uranussign" : uranussign, "neptunesign" : neptunesign, "ascendentsign" : ascendentsign}}}, callback);
}

module.exports.updateSelected = function(oldUsername, newUsername, oldEmail, newEmail, about, birthday, callback){


    if(newUsername != undefined){
    this.updateUsername(oldUsername, newUsername, function(err, user){
    if(err){
        throw err;
    }else{
        console.log(user);
    }
});
}
    if(newEmail != undefined){
    this.updateEmail(oldEmail, newEmail, function(err, user){
      if(err){
            throw err;
        }else{
             console.log(user);
        }

    });
}

}

module.exports.deleteFrom = function(username, popFrom, callback){
  Users.update({"Chats.from" : popFrom, "username" : username}, {$pull : {"Chats.from" : popFrom}}, {multi : false}, callback);
 console.log("from popFrom 3");
}

module.exports.deleteRecord = function(username, popRecord, callback){

  console.log("pop record" + popRecord);
        Users.update({"Chats.chat" : popRecord, "username" : username}, {$pull : {"Chats.chat" : popRecord}}, {multi : false}, callback);

}

module.exports.removeById = function(id, callback){
    Users.remove({"_id" : id}, callback);
}












