var Comment = require('./comment.model');
var Post = require('../posts/post.model')

module.exports = function(app) {


    app.get('/api/comments', function(req, res) {
        Comment.find(function(err, messages) {
            (err ? res.send(err) : res.json(messages));
        })
            .populate('post._id');
    });

    app.post('/api/comments', function(req, res) {
        Comment.create(req.body, function(err) {

            (err ? res.send(err) : res.status(200).send());
        });
    });

    app.delete('/api/comments/:id', function(req, res) {
        Comment.remove({_id: req.params.id}, function(err) {
            (err ? res.send(err) : res.status(200).send());
        });
    });
};