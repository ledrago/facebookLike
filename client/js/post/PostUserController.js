angular.module('app')
    .controller('PostUserController', function($scope, $http, $routeParams) {
        var _this = this;
        var id = $routeParams.id;

        this.getPosts = function(id) {
            id = $routeParams.id;
            $http.get('/api/posts/users/' + id)
                .then(function(res){
                    _this.posts = res.data;
                });
        };

        this.getPosts();

        this.removePost = function(id) {
            $http.delete('/api/posts/' + id)
                .then(function(){
                    _this.getPosts();
                });
        };


        this.sendPost = function() {
            if (!this.newpst || !this.newpst.text)
                return;
            id = $routeParams.id
            $http.post('api/users/posts/' + id, this.newpst)
                .then(function(){
                    _this.getPosts();
                });
            this.newpst = {};
        };


        this.sendComment = function(id){
            console.log("pipi")
            if (!this.newcmt[id].text)
                return
            console.log(this.newcmt[id])
            $http.post('/api/posts/' + id, {cmt: this.newcmt[id].text} )
                .then(function(){
                    _this.getPosts();
                });
            this.newcmt[id] = {};

        };

        this.removeComment = function(post_id, comment_id){
            $http.delete('api/posts/' + post_id + '/comments/' + comment_id)
                .then(function(){
                    _this.getPosts();
                })
        }

        this.friend = function(){
            console.log('tutu')
            id = $routeParams.id;
            $http.get('/api/posts/friends/' + id)
                .then(function(res){
                        _this.friend = res.data
                })

        }

        this.friend()

    })