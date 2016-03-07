angular.module('app')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $routeProvider
            .when('/users/SignUp', {
                templateUrl: 'views/user/SignUp.html',
                controller: 'UserController as user'
            })
            .when('/users/index', {
                templateUrl: '/views/user/index.html',
                controller: 'UserController as user'
            })
            .when('/user/friends', {
                templateUrl: 'views/user/friends.html',
                controller: 'UserController as user'
            })
            .when('/users/login', {
                templateUrl: 'views/user/login.html',
                controller: 'UserController as user'
            })
            .when('/users/SignIn', {
                templateUrl: 'views/user/SignIn.html',
                controller: 'UserController as user'
            })
            .when('/posts', {
                templateUrl: 'views/post/posts.html',
                controller: 'PostController as pst'
            })
            .when('/posts/users/:id', {
                templateUrl: 'views/post/postsUser.html',
                controller: 'PostUserController as pstu'
            })
            .when('/user/edit', {
                templateUrl: 'views/user/edit.html',
                controller: 'UserController as user'
            })
            .otherwise({
                templateUrl: 'views/home/home.html',
                controller: 'HomeController as home'
            });

        $locationProvider.html5Mode(true);

    }]);