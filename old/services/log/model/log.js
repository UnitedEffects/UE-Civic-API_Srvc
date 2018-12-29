/**
 * Created by borzou on 10/23/16.
 */

var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');
var searchPlugin = require('mongoose-search-plugin');

// Define our user schema
var locSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format(),
        expires: '30d'
    },
    code: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: false
    }
});

// Execute before each user.save() call
locSchema.pre('save', function(callback) {
    //console.log('log saved');
    return callback();
});

locSchema.plugin(searchPlugin, {
    fields: ['code', 'message', 'data']
});

// Export the Mongoose model
module.exports = mongoose.model('Log', locSchema);