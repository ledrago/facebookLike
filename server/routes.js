var path = require('path');
var express = require('express');



module.exports = function(app) {
    require('./users/routes_user')(app);
    require('./posts/routes_post')(app);
    require('./comments/routes_comment')(app);

    app.get('*', function(req, res) {
        res.sendFile(path.resolve('../Projet_MEAN/client/index.html'));
    });
};