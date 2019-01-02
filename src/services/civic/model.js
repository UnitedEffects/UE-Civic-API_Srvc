import mongoose from 'mongoose';
mongoose.Promise = Promise;
import moment from 'moment';

mongoose.set('useCreateIndex', true);
const civicSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format(),
        expires: '7d'
    },
    /**
     * Address could be any string; however, I use string-hash to encode it to avoid storing actual addresses.
     */
    address: {
        type: String,
        required: true
    },
    roles: Array,
    data: {
        type: Object,
        required: true
    }
});

civicSchema.pre('save', callback => callback());

export default mongoose.model('Civic', civicSchema);
