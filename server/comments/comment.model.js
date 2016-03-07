var mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
    text: {
        type: String,
        default: ''
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});