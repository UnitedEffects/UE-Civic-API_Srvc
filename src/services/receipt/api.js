import responder from '../responder';
import send from '../response';
import dal from './receipt';
import log from "../log/logs";

const payFactory = {
    async returnAll (req, res) {
        try {
            const query = req.query;
            return responder.send(res, await dal.returnAll(query));
        }catch(error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Receipts'))
        }
    },
    async returnMine (req, res) {
        try {
            const query = req.query;
            query.userId = req.user._id;
            return responder.send(res, await dal.returnAll(query));
        }catch(error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Receipts'))
        }
    },
    async returnOne (req, res) {
        try {
            const receipt = await dal.returnOne(req.params.guid);
            if(req.user.anon && !(await receipt.data.verifySessionAsync(req.query.pcSessionId))){
                return responder.sendUnauthorized(res);
            }
            return responder.send(res, receipt);
        } catch(error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Receipt'))
        }
    },
    async processAll (req, res) {
        try {
            const notProcessed = await dal._getAllNew();
            log.detail('NOTIFY', 'Attempting to process receipts with mailer', notProcessed);
            await dal._processReceipts(notProcessed);
            return responder.send(res, send.set200({ message: 'Beginning async notification of mailer service', total: notProcessed.length, receipts: notProcessed }, 'Event'));
        } catch(error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Receipts'))
        }
    }
};

export default payFactory;