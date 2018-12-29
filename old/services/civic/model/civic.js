/**
 * Created by borzou on 3/18/17.
 */
var Promise = require('bluebird');
var mongoose = Promise.promisifyAll(require('mongoose'));
var moment = require('moment');

// Define our user schema
var civicSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now(),
        expires: '100d'
    },
    address: {
        type: String,
        required: true
    },
    roles: {
        type: String,
        required: false
    },
    data: {
        type: Object,
        required: true
    }
});

// Execute before each user.save() call
civicSchema.pre('save', function(callback) {
    //console.log('log saved');
    return callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Civic', civicSchema);