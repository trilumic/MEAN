/*
 * IPA_Backend routes/projects
 * Maps methods defined in projectController to routes/URLs
 * */

//Fetch required express-module and project-controller
var express = require('express');
var router = express.Router();
var projects = require('../controllers/projectController');

//Definition of methods mapped to express-router-routes
// POST /projects
router.post('/', projects.post);

//GET /projects
router.get('/', projects.get);

// GET /projects/:id
router.get('/:id', projects.show);

// PUT /projects/:id
router.put('/:id', projects.put);

//DELETE /projects/:id
router.delete('/:id', projects.delete);

module.exports = router;
