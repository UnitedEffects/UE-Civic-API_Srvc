const config = {
    ENV: process.env.NODE_ENV || 'dev',
    MONGO: process.env.MONGO || 'mongodb://localhost:27017/ue-payment',
    SWAGGER: process.env.SWAGGER || 'localhost:3003',
    PROTOCOL: process.env.PROTOCOL || 'http',
    UEAUTH: process.env.DOMAIN || 'https://domainqa.unitedeffects.com',
    MAILER: process.env.MAILER || 'http://localhost:3001/api/process/cards',
    REPLICA: process.env.REPLICA || 'rs0',
    PRODUCT_SLUG: process.env.PRODUCT_SLUG || 'freedom_postcards',
    IMPLEMENTER: process.env.IMPLEMENTER || 'United Effects',
    CHARGE : process.env.STANDARD || 99,
    WEBHOOK: process.env.WEBHOOK || 'SUPESECRETWEBHOOK',
    STRIPE: process.env.STRIPE || 'STRIPEAPIKEY'
};

module.exports = config;
