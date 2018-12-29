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

civicSchema.pre('save', callback => //console.log('log saved');
    callback());

export default mongoose.model('Civic', civicSchema);
