/**
 * Created by borzou on 11/26/16.
 *
 * To use this config file in local development, simply manually change the name to config.js and update the strings.
 * To use this config file as part of an automated build process, rename the file to config.js as part of that build
 * process (mv config_changeme.js config.js) and be absolutely certain that you pass the appropriate env variables (the defaults will not work).
 */

var config = {
    defaultMongo: (process.env.MONGO) ? process.env.MONGO : 'mongodb://localhost:27017/ue-civic',
    swaggerDomain: (process.env.SWAG_DOM) ? process.env.SWAG_DOM : 'localhost:4050',
    userApiServer: (process.env.USERAUTH) ? process.env.USERAUTH : 'http://localhost:4000',
    authApiServer: (process.env.DOMAIN) ? process.env.DOMAIN : 'http://localhost:4010',
    replica: process.env.REPLICA,
    civic: (process.env.CIVIC) ? process.env.CIVIC : 'YOUR-CIVIC-API-TOKEN'
};

module.exports = config;
