import stripeApi from 'stripe';
const config = require('../../config');
const stripe = stripeApi(config.STRIPE);

const stripeFactory = {
    async _charge (payment) {
        return await stripe.charges.create({
            amount: payment.amount,
            currency: 'usd',
            description: 'MailMyVoice.com Postcard Purchase',
            source: payment.stripeToken,
            metadata: {
                userId: payment.userId,
                email: payment.email,
                postcards: JSON.stringify(payment.postcards),
                pcSessionId: payment.pcSessionId
            }
        });
    }
};

export default stripeFactory;