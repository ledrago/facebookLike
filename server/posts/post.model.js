var mongoose = require('mongoose');
Schema = mongoose.Schema


var Comments = new Schema({
    creator : String,
    text : String,
    date : Date
});

var Post = new Schema({

    creator : { type: String, ref: 'User'},
    recipient: {type: String, ref: 'User'},
    text   : String,
    img :     {data: Buffer, type: String},
    created   : {type: Date, default:Date.now},
    comments : [Comments]
});

module.exports = mongoose.model('Post', Post);