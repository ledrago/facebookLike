var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var express = require('express');
var app = express();


app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://mathieu:mathieu2016@ds047935.mongolab.com:47935/finchdb');

app.use(function(req, res) {
    req.next();
});
app.use(express.static(__dirname + '/../client'));
require('./routes')(app);

app.listen(process.env.PORT || 3700);

console.log("Let's go on port ", process.env.PORT || 3700);