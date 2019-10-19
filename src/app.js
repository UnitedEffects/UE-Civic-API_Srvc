/**
 * Created by borzou on 9/27/16.
 */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import path from 'path';
import respond from './services/responder';
import response from './services/response';
import index from './routes/index';
import api from './routes/api_v2';
const app = express();
const debug = Debug('ue-civic:app');
app.set('views', path.join(__dirname, '../views'));

// view engine setup
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/swagger', express.static(path.join(__dirname, '../public/swagger')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
    next();
});


app.use('/', index);
app.use('/api/', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(response.fail404('Page or Resource Not Found'));
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    return respond.send(res, response.set(err.status || err.code || 500, err.data || err.message || 'unknown error'));
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
    debug('Caught exception: %j', err);
    console.error({error: "UNCAUGHT EXCEPTION", stack: err.stack || err.message});
});

export default app;