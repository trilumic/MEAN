/**
 * Created by michelt.
 Controller for projects, defines methods for GET, POST, PUT and DELETE to save, mutate, delete and retrieve projects
 */

//Fetch required modules
require('../models/project');
var mongoose = require('mongoose');
var _ = require('underscore');
var winston = require('winston');
var http = require('http');
//Fetch project model
var Project = mongoose.model('Projects');

//Define winston-logger
winston.add(winston.transports.File, { filename: 'ccyp_backend.log' });


//POST /projects/ ; saves a new project in DB
exports.post = function(request, response){
    var auth = request.get('Authorization');
    winston.log('info', auth);
    if(Sort.isInArray(auth, currentUserTokens)){
        winston.log('info', 'Auth is OK!');
        var project = new Project(request.body);
        project.project.start_date = formatDate(project.project.start_date);
        project.project.end_date = formatDate(project.project.end_date);
        project.save(function error(error){
            if(error){
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Could not save project, ' + error);
            }
            response.jsonp(project);
        });

    }else{
        winston.log('info', 'Auth not valid!');
        response.status('400');
    }


};

//GET /projects/ ; returns an array of all saved projects
exports.get = function(request, response){

    var auth = request.get('Authorization');

    winston.log('info', 'Auth-Token is: ' + auth);
    if(Sort.isInArray(auth, currentUserTokens)){
        winston.log('info', 'Projects.get: Auth is OK!');

        Project.find().exec(function(error, projects) {
            if(error){
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Getting projects failed, ' + error);
            }
            response.jsonp(projects);
        });
    }
    else
    {
        winston.log('info', 'Projects.get: Auth not valid!');
        response.status('400').send('Auth not valid!');
    }
};

//GET /projects/:id ; retrieve one project by id
exports.show = function(request, response){
    var auth = request.get('Authorization');
    if(Sort.isInArray(auth, currentUserTokens)){
        Project.load(request.params.id, function (error, projects) {
            if(error){
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Loading project with ID ' + request.params.id + ' failed, ' + error);
            }
            response.jsonp(projects);
        });
    }
    else
    {
        winston.log('info', 'Projects.get: Auth not valid!');
        response.status('400').send('Auth not valid!');;
    }

};

//PUT /projects/:id ; updates project with specified id (:id)
exports.put = function(request, response){
    var auth = request.get('Authorization');
    if(Sort.isInArray(auth, currentUserTokens)){
        Project.load(request.params.id, function (error, project) {
            if(error){
                var date = new Date().toLocaleString();
                console.log(date +' ERROR: Updating project failed, ' + error);
            }
            project = _.extend(project, request.body);
            project.project.start_date = formatDate(project.project.start_date);
            project.project.end_date = formatDate(project.project.end_date);
            project.state = "Mutated";
            project.save(function (error) {
                if(error){
                    var date = new Date().toLocaleString();
                    console.log(date +' ERROR: Updating project failed, ' + error);
                }
                winston.log('info', 'Project ' + project._id + ' was mutated');
                response.jsonp(project);
            });
        });
    }
    else
    {
        winston.log('info', 'Projects.put: Auth not valid!');
        response.status('400').send('Auth not valid!');;
    }

};

//DELETE /projects/:id ; sets project with specified id (:id) to state "Deleted"
exports.delete = function(request, response){
    var auth = request.get('Authorization');
    if(Sort.isInArray(auth, currentUserTokens)){
        Project.load(request.params.id, function(error, project){

            project.state = "Deleted";
            project.show = false;
            project.save(function (error) {
                if(error){
                    var date = new Date().toLocaleString();
                    console.log(date +' ERROR: Updating project failed, ' + error);
                }
                winston.log('info','Project ' + project._id + ' was deleted')
                response.jsonp(project);
            });
        });
    }
    else
    {
        winston.log('info', 'Projects.delete: Auth not valid!');
        response.status('400').send('Auth not valid!');;
    }
};

//Format-Function for start- and end date
function formatDate(string){
    var day = string.substring(8,10);
    var month = string.substring(5,7);
    var year = string.substring(0,4);
    var date = day + "." + month + "." + year;
    return date;

};


//Helper object/function for Token-Array
var Sort = {
    isInArray: function (value, array) {
        return array.indexOf(value) > -1;
    }
};

/*
Base64-function provided by a tutorial project by Remo Lötscher, available on
https://scotch.io/quick-tips/how-to-encode-and-decode-strings-with-base64-in-javascript
 */
var Base64 = {
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', encode: function (e) {
        var t = '';
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    }, decode: function (e) {
        var t = '';
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    }, _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, '\n');
        var t = '';
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    }, _utf8_decode: function (e) {
        var t = '';
        var n = 0;
        var r = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
};

