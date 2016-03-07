var Post = require('./post.model');
var Users = require('../users/user.model');
var multiparty = require('multiparty');
var fs = require('fs');
var uuid = require('node-uuid');

module.exports = function(app) {


    app.use(function(req,res,next){
        if(req.session && req.session.user)
        {
            Users.findOne({email: req.session.user.email},function(err,user){
                if(user){
                    req.user = user;
                }
                next()
            });
        }else{
            next()
        }
    })
    function isAuthentificated(req,res,next){
        if(req.user){
            next()
        }
    }

    app.delete('/api/posts/:id', isAuthentificated, function(req, res) {
        Post.remove({_id: req.params.id}, function(err) {
            (err ? res.send(err) : res.status(200).send());
        });
    });

    app.post('/api/posts', isAuthentificated, function(req, res) {
        req.body.creator = req.session.user._id
        req.body.recipient = req.session.user._id
        Post.create(req.body, function(err) {
            (err ? res.send(err) : res.status(200).send());
        });
    });



    app.get('/api/posts/', isAuthentificated, function(req, res) {
        Post.find({})
        .populate('creator recipient')
        .exec(function(err, posts) {
            (err ? res.send(err) : res.json(posts));
        });
    });


    app.post('/api/posts/:id', isAuthentificated, function(req, res){
        Post.findById({_id: req.params.id}, function(err, post){
            if(!err){
                post.comments.push({text: req.body.cmt, creator: req.session.user.first_name});
                post.save(function(err, post) {
                    if (!err) {
                        res.status(200).send();
                    }
                })
            }
            else
            {
                console.log("Error");
                res.send(err);
            }
        });
    });

    app.delete('/api/posts/:id/comments/:comment_id', isAuthentificated, function(req, res){
        Post.findById({_id: req.params.id}, function(err, post){
            if(!err){
                post.comments.remove({_id: req.params.comment_id});
                post.save(function(err){
                    if(!err) {
                        res.status(200).send();
                    }
                });
            };
        });
    });


   /* Section Posts and Comments Users*/

    app.get('/api/posts/users/:id', isAuthentificated, function(req, res) {
        Post.find({recipient: req.params.id})
            .populate('creator recipient')
            .exec(function(err, posts) {
                (err ? res.send(err) : res.json(posts));
            });
    });


    app.post('/api/users/posts/:id',isAuthentificated, function(req, res) {
        req.body.creator = req.session.user._id
        req.body.recipient = req.params.id
        Post.create(req.body, function(err) {
            (err ? res.send(err) : res.status(200).send());
        });
    });


    app.get('/api/posts/friends/:id',isAuthentificated, function(req, res){
        Users.findById(req.session.user._id, function(err, user){
            Users.getAcceptedFriends(user, {_id: req.params.id}, function(err, friend){
                (err ? console.log("Id not found") : res.json(friend));
            })
        })

    })

    app.get('/api/posts/getfriends/',isAuthentificated, function(req, res){
        Users.findById(req.session.user._id, function(err, user){
            Users.getAcceptedFriends(user, {}, function(err, friends){
                (err ? console.log("Id not found") : res.json(friends));
            })
        })

    })

    /*app.post('api/upload/image'), function(req, res){
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files){
            var file = files.file[0];
            var contentType = file.headers['content-type'];
            var tmpPath = file.path;
            var extIndex = tmpPath.lastIndexOf('.');
            var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
            var fileName = uuid.v4() + extension;
            var destPath = '../images/' + fileName;

            if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
                fs.unlink(tmpPath);
                return res.status(400).send('Unsupported file type.');
            }

            fs.rename(tmpPath, destPath, function(err){
                if (err) {
                    return res.status(400).send('Image is not saved:');
                }
                return res.json(destpath);
            });
        });
    };*/


};