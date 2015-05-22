/*
 * IPA_Backend models/user
 * Defines database model/schema for users
 * */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//User-model-definition, specifies schema for the database
var userSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    _email: String,
    password: String
}, {collection: 'users'});

//Define functions for user-schema (load-function)
userSchema.statics = {
    load: function(email, callback){
        this.findOne({ _email: email}).exec(callback);
    }
};
//Set schema on mongoose-model "User" and define collection in database
mongoose.model('User', userSchema, 'users');
