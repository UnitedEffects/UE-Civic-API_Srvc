const config = {
    ENV: process.env.NODE_ENV || 'dev',
    MONGO: process.env.MONGO || 'mongodb://localhost:27017/mmv-civic',
    SWAGGER: process.env.SWAGGER || 'localhost:4050',
    PROTOCOL: process.env.PROTOCOL || 'http',
    UEAUTH: process.env.DOMAIN || 'https://domainqa.unitedeffects.com',
    REPLICA: process.env.REPLICA || 'rs0',
    PRODUCT_SLUG: process.env.PRODUCT_SLUG || 'ueauth_product_slug',
    IMPLEMENTER: process.env.IMPLEMENTER || 'United Effects',
    CIVIC: process.env.CIVIC || 'CIVICAPIKEY'
};

module.exports = config;
