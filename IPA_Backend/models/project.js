/*
 * IPA_Backend models/projects
 * Defines database model/schema for projects
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Project-model-definition, specifies schema for the database
var projectSchema = new Schema({
    created: {
        type: Date,
        default: Date.now()
    },
    project: {

        title: String,
        description_short: String,
        description_full: String,
        expertise: String,
        start_date: String,
        end_date: String
    },
    contact:{
        company: String,
        OU: String,
        name: String,
        first_name: String,
        address: String,
        ZIP: String,
        location: String,
        telephone: String,
        mail: String
    },
    workspace: {
        address: String,
        ZIP: String,
        location: String
    },
    state: {
        type: String,
        default: "Default"
    },
    show: {
        type: Boolean,
        default: true
    }
}, {collection: 'project'});

//Define functions for project-schema (load-function)
projectSchema.statics = {
    load: function(id, callback){
        this.findOne({ _id : id}).exec(callback);
    }
};

//Set schema on mongoose-model "Projects"
mongoose.model('Projects', projectSchema);