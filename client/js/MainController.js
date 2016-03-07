angular.module('app')
    .controller('MainController', function($scope, $http, $location) {

        this.name = "";
        this.session = "ko";
        this.usr;
        this.pendings;
        this.notifications;

        $http.post('/api/me')
            .then(function (res) {
                if (res.data._id)
                {
                    $scope.main.usr = res.data
                    $scope.main.name = res.data.first_name;
                    $scope.main.session = "ok"
                }

            });

        this.signout = function() {
            $http.post('/logout')
                .then(function (res) {
                    $scope.main.name = ""
                    $scope.main.session = "ko";
                    $scope.main.user = {};
                    $location.path('/users/SignIn')
                });
        };

        this.confirmfriend = function(id,user) {
            console.log("je passe par confimfriend")
            $http.put('/api/users/' + id + '/confirmfriend', user)
                .then(function (err,res) {
                    if(err){
                        console.log("erreur confirmfriend :" + err)
                    }
                    else{
                        console.log("ok confirmfriend :" + res.data)
                    }
                });
        };
    });