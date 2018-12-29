import express from 'express';
import log from '../services/log/api';
import auth from '../services/auth/api';
import rbac from '../services/auth/roleApi';
import stripeApi from '../services/stripe/api';
import payApi from '../services/receipt/api';
const config = require('../config');
const pJson = require('../../package.json');
const router = express.Router();

function allowAnon (req, res, next) {
    if(!req.headers.authorization) req.headers.authorization = 'bearer anon';
    return next();
}

router.get('/version', function(req, res, next) {
    res.json( {
        err: null,
        message: {
            service: 'MailMyVoice.com Payment Service',
            implementer: config.IMPLEMENTER,
            git: 'https://github.com/UnitedEffects/UE-PC-Payment_Srvc',
            version: pJson.version,
            currentMaintainers: pJson.contributors,
            baseURL: '/api',
            copyright: 'Copyright (c) 2018-19 theBoEffect LLC DBA United Effects'
        }
    });
});

//testing
router.post('/payment/test', (req, res) => {res.json(req.body);});
router.post('/payment', [allowAnon, auth.isOptionalAuthenticated], stripeApi.charge);
router.get('/payment', [auth.isBearerAuthenticated, rbac.middleAny], payApi.returnAll);
router.get('/payment/:guid', [allowAnon, auth.isOptionalAuthenticated], payApi.returnOne);
router.get('/my/payment', [auth.isBearerAuthenticated, rbac.middleAny], payApi.returnMine);

//event
router.post('/payment/process', auth.isWebHookAuthorized, payApi.processAll);

// Log and Health
router.get('/logs', [auth.isBearerAuthenticated, rbac.middleAny], log.getLogs);
router.get('/logs/:code', [auth.isBearerAuthenticated, rbac.middleAny], log.getLogByCode);
router.get('/logs/:code/:timestamp', [auth.isBearerAuthenticated, rbac.middleAny], log.getLog);
router.post('/logs', [auth.isBearerAuthenticated, rbac.middleAny], log.writeLog);
router.get('/health', function(req, res){
    res.json({data: {server: 'running'}});
});

export default router;