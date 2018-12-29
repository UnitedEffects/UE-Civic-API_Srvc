'use strict';

// enables ES6 ('import'.. etc) in Node
require('babel-core/register');
require('babel-polyfill');

const mongoose = require('mongoose');
const app = require('../app').default;
const debug = require('debug')('ue-civic:app');
const http = require('http');
const config = require('../config');

const mongoConnect = config.MONGO;

if (!mongoConnect) {
    console.error('Mongo Connection not set. Exiting.');
    process.exit(1);
}

console.info(`Connection string: ${mongoConnect}`);

const mongoOptions = {
    keepAlive: 300000,
    connectTimeoutMS: 10000,
    useNewUrlParser: true,
    promiseLibrary: Promise
};

if (config.ENV === 'production') mongoOptions.replicaSet = config.REPLICA;

function connectionM() {
    mongoose.connect(`${mongoConnect}?authSource=admin`, mongoOptions)
        .then(() => console.info('mongo connected'))
        .catch((err) => {
            console.info('********************************************ERROR*******************************************');
            console.info('Unable to connect to the database - this service will not persist data');
            console.info(`DB attempted:  ${mongoConnect}`);
            console.info('Please check that the database is running and try again.');
            console.info('DETAILED ERROR BELOW');
            console.info(err);
            console.info('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ERROR^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            setTimeout(() => {
                connectionM();
            }, 2000);
        });
}
connectionM();

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '4050');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */

server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            debug(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

/**
 * Event listener for HTTP server "listening" event.
 */

server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    console.info(`Listening on ${bind}`);
});
