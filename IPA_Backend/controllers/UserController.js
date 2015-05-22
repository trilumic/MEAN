/**
 * Created by michelt.
 Controller for users, defines methods for GET, POST, PUT and DELETE to register, login and logout users.
 */
require('../models/user');
var mongoose = require('mongoose');
var winston = require('winston');
var _ = require('underscore');
md5 = require('js-md5');

//Fetch mongoose-model for users
var User = mongoose.model('User');

//globally define user token-array
currentUserTokens = [];

//POST /register, function to create a new user in database
exports.register = function(request, response) {

    var salt = md5("superSaltySuperSaltShallSafelySecureSeveralSecuritySentences");
    var user = new User(request.body);
    winston.info("UserPWD: " + user.password)
    user.password = request.body.password + salt;

    winston.info("Salt: " + salt);
    winston.info("Request.user.pw: " + request.body.password);
    winston.info("User.pw: " + user.password);


    user.save(function error(error){
        if(error){
            var date = new Date().toLocaleString();
            console.log(date +' ERROR: Could not register user, ' + error);
        }
    });
    response.jsonp(user);

};

/* POST /login, function checking database for the requested user
Creates a token combining email and a timestamp, which is saved in a token-array and used to check resource request from clients
 */

exports.login = function(request, response){

    winston.info(request.body._email);


    User.load(request.body._email, function (error, user) {

        if (error) {
            var date = new Date().toLocaleString();
            //console.log(date + ' ERROR: Could not load user, ' + error);
            winston.info(date + ' ERROR: Could not load user, ' + error);
            response.status('400').send('User not found, not authenticated');

        } else if (user === 'undefined' || user === null) {
            response.status('400').send('User not found, not authenticated');
        }else{
            winston.info("In Login, request.pw = " + request.body.password);
            var salt = md5("superSaltySuperSaltShallSafelySecureSeveralSecuritySentences");
            winston.info("In Login, request.pw + salt = " + request.body.password + salt);
            var pwToCheck = request.body.password + salt;
            winston.info("PW + Salt: " + pwToCheck);
            winston.info("PW user-obj: "+ user.password);

            if( pwToCheck === user.password){

                winston.info('Loaded User._email: ' + user._email);
                var userToken = Base64.encode(user._email  + Date.now());
                currentUserTokens.push(userToken);
                response.jsonp(userToken);
            }else{
                response.jsonp("Invalid");
            }
        }
    });
};

//POST /logout, function to delete user-token in backend
exports.logout = function(request, response){
    var auth = request.get('Authorization');
    if(Sort.isInArray(auth, currentUserTokens)){
        var index = currentUserTokens.indexOf(auth);
        currentUserTokens.splice(index, 1);
        winston.info('User logged out');
        winston.info(currentUserTokens.length);
        response.jsonp('Logged out');
    }
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
}



