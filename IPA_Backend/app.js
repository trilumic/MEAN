/*
IPA_Backend-app
Main file,
    -   contains all required modules
    -   creates database connection
    -   handles errors in database connection
*/

//EXPRESS
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//CORS-Module Node.js
var cors = require('cors');

//ROUTES
var projects = require('./routes/projects');
var user = require('./routes/user');

//EXPRESS
var app = express();


//MONGOOSE
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ccyp');
var db = mongoose.connection;

//Error handling (DB-Connection)
db.on('error', function callback(){
    console.log('Verbindung zu MongoDB fehlgeschlagen');
});
db.once('open', function callback(){
    console.log('Verbindung erfolgreich');
});

//Adding used modules to express
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/projects', projects);
app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
});


module.exports = app;
