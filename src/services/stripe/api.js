import uuidv1 from 'uuid/v1';
import responder from '../responder';
import send from '../response';
import joi from 'joi';
import dal from './stripe';
import pay from '../receipt/receipt'
import log from "../log/logs";
const config = require('../../config');

const stripeApi = {
    async charge (req, res) {
        try {
            // Grab payment object and make modificiations depending on anon status
            const payment = JSON.parse(JSON.stringify(req.body));
            if(req.user.anon && !payment.pcSessionId) return responder.send(res, send.fail400('An anon payment requires a session ID from the mailer service'));
            if(!payment.userId) payment.userId = 'anon';
            // Use email instead of stripeEmail internally to the service
            payment.email = payment.stripeEmail;
            delete payment.stripeEmail;
            // If you're logged in, use ID and registered email
            if(!req.user.anon) {
                payment.userId = req.user._id;
                payment.email = req.user.email;
            }
            // General schema validation
            const schema = joi.object({ allowUnknown: false }).keys({
                amount: joi.number().required(),
                userId: joi.string(),
                pcSessionId: joi.string(),
                postcards: joi.array().required(),
                email: joi.string().email({ minDomainAtoms: 2 }).required(),
                discountCode: joi.string(),
                stripeToken: joi.string().required(),
                stripeTokenType: joi.string().valid(['card']).required()
            });
            await joi.validate(payment, schema);
            // Make sure the payment amount makes sense
            const setAmount = payment.amount;
            payment.amount = config.CHARGE * payment.postcards.length;
            // Future dev: apply discount if present
            if(setAmount !== payment.amount) return responder.send(res, send.fail400(`You attempted a charge for ${setAmount} but this service calculates the actual amount as ${payment.amount}`));
            // Charge using stripe
            const receipt = await dal._charge(payment);
            if(!receipt.id) {
                log.detail('ERROR', 'Unexpected return from stripe', receipt);
                return responder.send(res, send.fail400('There was an unexpected return from stripe.'));
            }
            // Record the payment as a receipt
            const record = await pay._createOne({
                guid:  uuidv1(),
                userId: payment.userId,
                email: payment.email,
                pcSessionId: payment.pcSessionId,
                postcards: payment.postcards,
                extReceiptId: receipt.id,
                receipt: receipt
            });
            record.pcSessionId = payment.pcSessionId;
            // Async processing with mailer service
            const result = await pay._notifyMailer(payment.postcards, receipt);
            console.log('********************************************************');
            console.log(result.status);
            console.log(result.data);
            console.log('********************************************************');
            // If cards were processed, set the payment to processed
            if(result.status === 200) await pay._updateOne(record.guid, {state: 'processed'});
            else log.detail('ERROR', 'COULD NOT UPDATE PAYMENT, SUCCESS NOT TRUE', success);
            // Respond with the payment
            return responder.send(res, send.set200(record, 'Payment'));
        } catch (error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Payment'))
        }
    }
};

export default stripeApi;