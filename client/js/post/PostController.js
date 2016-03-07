angular.module('app')
    .controller('PostController', function($scope, $http) {
        var _this = this;

        this.getPosts = function() {
            $http.get('/api/posts')
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
            $http.post('api/posts', this.newpst)
                .then(function(){
                    _this.getPosts();
                });
            this.newpst = {};
        };


        this.sendComment = function(id){
            if (!this.newcmt[id].text)
                return
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

        this.getFriends = function(){
            $http.get('/api/posts/getfriends/')
                .then(function(res){
                    _this.friends = res.data
                })
        }

        this.getFriends();

        /*this.onFileSelect = function(image){
            if (angular.isArrray(image)){
                image = image[0];
            }

            if(image.type !== 'image/png' && image.type !== 'image/jpeg'){
                alert('Only Png and Jpeg are accepted.');
                return;
            }

            this.uploadInProgress = true;
            this.uploadProgress = 0;

            this.upload = $upload.upload({
                url: '/upload/image',
                method: 'POST',
                file: image
            }).progress(function(event){
                this.uploadProgress = Math.floor(event.loaded / event.total);
                this.$apply();
            }).sucess(function(data, status, headers, config){
                this.uploadInProgress = false;
                this.uploadedImage = JSON.parse(data);
            }).error(function(err){
                this.uploadInProgress = false;
                console.log('Error uploading file:' + err.message || err)
            });
        };*/

    })