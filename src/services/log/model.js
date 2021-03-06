/**
 * Created by bmotlagh on 10/23/17.
 */

import mongoose from 'mongoose';
mongoose.Promise = Promise;
import moment from 'moment';

mongoose.set('useCreateIndex', true);
const logSchema = new mongoose.Schema({
    logTimestamp: {
        type: Date,
        default: moment().format(),
        expires: '30d'
    },
    logCode: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    details: {
        type: Object,
        required: false
    }
});

// Execute before each user.save() call
logSchema.pre('save', callback => //console.log('log saved');
    callback());

// Export the Mongoose model
export default mongoose.model('Log', logSchema);
