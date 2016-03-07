angular.module('app')
    .controller('UserController', function($scope, $http, md5, $location) {
        var _this = this;
        this.usr = $scope.main.usr;

        this.getPendings = function (id) {
            $http.get('api/users/' + id + '/FriendRequest')
                .then(function (res) {
                    _this.pendings = res.data;
                    $scope.main.pendings = res.data;
                    $scope.main.notifications = res.data.length;
                });
        };

        this.getfriends = function(id) {
            $http.get('api/users/' + id + '/Friend')
                .then(function (res) {
                    _this.friends = res.data;
                    return res.data;
                });
        };

        this.getfriend = function(id) {
            var kevin = id;
            $http.get('/api/posts/friends/' + kevin)
                .then(function (res) {
                    console.log(res.data);
                    _this.friend = res.data;
                });
        };

        this.getUsers = function () {
            $http.get('/api/users')
                .then(function (res) {
                    _this.users = res.data;
                });
        };

        this.getUsers();
        if(this.usr != undefined)
        {
            this.getPendings(this.usr._id);
            this.getfriends(this.usr._id);
        }


        this.removeUser = function(id) {
            $http.delete('/api/user/' + id);
            $scope.main.signout();
        };

        this.signin = function() {
            var hashedPassword = md5.createHash(this.user.password);
            this.user.password = hashedPassword
            $http.post('/login', this.user)
                .then(function (res) {
                    $scope.login = {status: 'ok'} ;
                    $scope.main.usr = res.data;
                    $scope.main.name = res.data.first_name;
                    $scope.main.session = "ok";
                    $location.path('/')
                },function (res){
                    $scope.login = {status: 'ko'} ;
            });
        };

        this.sendUser = function() {
            if (!this.newuser || !this.newuser.first_name || !this.newuser.last_name || !this.newuser.email || !this.newuser.password)
                return;
            var hashedPassword = md5.createHash(this.newuser.password);
            this.newuser.password = hashedPassword;
            this.newuser.admin = 0
            $http.post('/signup', this.newuser)
                .then(function () {
                    _this.getUser();
                });
            this.newuser = {};
        };

        this.editUser = function(id) {
            if(!this.user)
                return;
            if(!this.user.first_name)
                this.user.first_name = $scope.user.usr.first_name;
            if(!this.user.last_name)
                this.user.last_name = $scope.user.usr.last_name;
            if(!this.user.email )
                this.user.email  = $scope.user.usr.email;
            if(!this.user.password )
            {
                this.user.email  = $scope.user.usr.password
            }
                else
            {
                var hashedPassword = md5.createHash(this.user.password);
                this.user.password = hashedPassword;
            }
            this.user._id = $scope.user.usr._id
            $scope.user.usr = this.user;
            $scope.main.name = this.user.first_name;

            $http.post('/api/users/' + id, this.user)
                .then(function () {
                    _this.getUser();
                });
            this.newuser = {};
        };

        this.addfriend = function(id,user) {
            $http.put('/api/users/' + id + '/addfriend', user)
                .then(function (err,res) {
                   if(err){
                       console.log("erreur addfriend :" + err)
                   }
                    else{
                       console.log("ok addfriend :" + res.data)
                       $scope.main.usr = res.data
                   }
                });
        }



        this.removefriend = function(user1,user2) {
            $http.put('/api/users/removefriend', [user1, user2])
                .then(function (err,res) {
                    if(err){
                        console.log("error removefriend :" + err)
                    }
                    else{
                        console.log("ok removefriend :" + res.data)
                        $scope.main.usr = res.data
                    }
                });
        }
    });