import mongoose from 'mongoose';
mongoose.Promise = Promise;
import moment from 'moment';
import bcrypt from 'bcrypt-nodejs';
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const paymentSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: moment().format()
    },
    guid: {
        type: String,
        required: true
    },
    userId: String,
    email: {
        type: String,
        required: true
    },
    pcSessionId: String,
    postcards: {
        type: Array,
        required: true
    },
    state: {
        type: String,
        default: 'new',
        enum: ['new', 'processed']
    },
    extReceiptId: String,
    receipt: {
        type: Object,
        required: true
    }
});

paymentSchema.pre('save', function(callback) {
    const pay = this;

    if (!pay.isModified('pcSessionId')) return callback();

    bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(pay.pcSessionId, salt, null, (err, hash) => {
            if (err) return callback(err);
            pay.pcSessionId = hash;
            callback();
        });
    });
});

paymentSchema.methods.verifySessionAsync = function(session) {
    return new Promise((resolve, reject) => {
        if(!session) return resolve(false);
        bcrypt.compare(session, this.pcSessionId, (err, isMatch) => {
            if (err) return reject(err);
            return resolve(isMatch)
        });
    })
};

export default mongoose.model('Payment', paymentSchema);