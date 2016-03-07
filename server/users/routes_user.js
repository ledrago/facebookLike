var Users = require('./user.model');
const crypto = require('crypto');



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



    app.post('/api/me', function(req, res) {
        if(req.session.user){
            res.json(req.session.user).send();
        }
        else{
            res.status(200).send({});
        }
        });

    app.get('/api/users',isAuthentificated, function(req, res) {
        Users.find(function(err, users) {
            (err ? res.send(err) : res.json(users));
        });
    });

    app.get('/api/users/:id',isAuthentificated, function(req, res) {
        Users.findById(req.params.id,function(err, user) {
            (err ? res.send(err) : res.json(user));
        });
    });

    app.get('/api/users/:id/FriendRequest',isAuthentificated, function(req, res) {
        Users.findById(req.params.id, function(err, user) {
            var pending = [];
            Users.getFriends(user, function (err, friendships) {

                    for (var i = 0; i < friendships.length; i++) {
                        if(friendships[i]["status"] == "pending"){
                            pending.push(friendships[i]["_id"]);
                        }
                    }
                    Users.find({
                        '_id': { $in: pending}
                    }, function(err, user){
                        (err ? res.send(err) : res.json(user));
                    });

                }
            );
        })
    });


    app.get('/api/users/:id/Friend', isAuthentificated, function(req, res) {
        Users.findById(req.params.id, function(err, user) {
            var friends = [];
            Users.getFriends(user, function (err, friendships) {

                    for (var i = 0; i < friendships.length; i++) {
                        if(friendships[i]["status"] == "accepted"){
                            friends.push(friendships[i]["_id"]);
                        }
                    }
                    Users.find({
                        '_id': { $in: friends}
                    }, function(err, user){
                        (err ? res.send(err) : res.json(user));
                    });

                }
            );
        })
    });

    app.get('/api/user/friends', isAuthentificated,function(req, res) {
        Users.find({'id':{$in: req.body.friends}},function(err, users) {
            (err ? res.send(err) : res.json(users));
        });
    });

    app.get('/api/user/:id', function(req, res) {
        Users.findById(req.params.id,function(err, user) {
            (err ? res.send(err) : res.json(user));
        });
    });


    app.post('/login', function(req, res) {
        Users.find({email: req.body.email},function(err, user) {
            if (user.length == 0){
                res.status(400).send("wrong login");
            }
            else{
               if (user[0].password !=  req.body.password){
                   res.status(400).send("wrong password")
                }
                else {
                   sess=req.session;
                   req.session.user = user[0];
                   res.json(req.session.user).send();
               }
            }
        });
    });

    app.post('/signup', function(req, res) {
        Users.create(req.body, function(err) {

            (err ? res.send(err) : res.status(200).send());
        });
    });

    app.put('/api/users/:id/addfriend',isAuthentificated, function(req, res) {
        Users.requestFriend(req.params.id, req.body._id,
            function(err,user) {
                if(err){

                }
                else{
                    req.session.user = user[0];
                }
        });
    });

    app.put('/api/users/:id/confirmfriend',isAuthentificated, function(req, res) {

        Users.requestFriend(req.params.id, req.body._id,
            function(err) {
            });
    });

    app.put('/api/users/removefriend',isAuthentificated, function(req, res) {
        Users.removeFriend(req.body[0], req.body[1],
            function(err) {
                if(err){
                    console.log(err)
                }
                else{
                    res.status(200).send("caca");
                }
            });
    });


    app.post('/api/users/:id',isAuthentificated, function(req, res) {
        Users.update({_id: req.params.id},req.body,function(err, user) {
            if(err)
            {
                res.send(err)
            }
            else
            {
                res.json(user)
                req.session.user = user[0];
            }
        });
    });

    app.post('/logout',function(req,res){

        req.session.destroy(function(err){
            if(err){
            }
            else
            {
                res.redirect('/');
            }
        });

    });

        app.delete('/api/user/:id',isAuthentificated, function(req, res) {
        Users.remove({_id: req.params.id}, function(err) {
            (err ? res.send(err) : res.status(200).send());
        });
    });
};