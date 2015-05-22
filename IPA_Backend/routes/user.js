/*
* IPA_Backend routes/user
* Maps methods defined in userController to routes/URLs
* */

//Fetch required express-module and user-controller
var express = require('express');
var router = express.Router();
var user = require('../controllers/userController');

//Definition of methods mapped to express-router-routes
// POST /user
router.post('/', user.login);

//POST /user/register
router.post('/register', user.register);

//POST /user/logout
router.post('/logout', user.logout);

module.exports = router;