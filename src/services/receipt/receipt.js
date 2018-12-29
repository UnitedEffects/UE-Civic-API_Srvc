import Receipt from './model';
import send from '../response';
import axios from 'axios';
import log from '../log/logs';
const config = require('../../config');

const receiptFactory = {
    async _createOne(data) {
        const receipt = new Receipt(data);
        return await receipt.save();
    },
    async _updateOne(guid, update) {
        return await Receipt.findOneAndUpdate({ guid }, update, {new: true});
    },
    async returnAll(query) {
        return send.set200(await Receipt.find(query), 'Receipts');
    },
    async returnOne(guid) {
        const receipt = await Receipt.findOne({guid});
        if(!receipt) throw send.fail404(guid);
        return send.set200(receipt, 'Receipt');
    },
    async _getAllNew() {
        return await Receipt.find({state: 'new'}).limit(25);
    },
    async _notifyMailer (cards, receipt) {
        const options = {
            method: 'POST',
            url: `${config.MAILER}?code=${config.WEBHOOK}`,
            data: {
                guids: cards,
                receipt
            }
        };
        const result = await axios(options);
        if(result.status !== 200) throw send.fail400({ message: 'Unexpected response from mailer', status: result.status, body: result.data });
        return result;
    },
    _processReceipts (receipts) {
        return Promise.all(receipts.map(async (payment) => {
            const result = await receiptFactory._notifyMailer(payment.postcards, payment.receipt);
            if(result.status === 200) await receiptFactory._updateOne(payment.guid, { state: 'processed' });
            else log.detail('ERROR', `Update failed on ${payment.guid}`, payment);
        }))
    }
};

export default receiptFactory;