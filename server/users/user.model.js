var mongoose = require('mongoose');
var friends = require("mongoose-friends");
var Schema = mongoose.Schema;

var User = new Schema ({
    first_name : String,
    last_name : String,
    email : String,
    password : String,
    admin : Number
});
User.plugin(friends({pathName: "friends"}));
module.exports = mongoose.model('User', User);