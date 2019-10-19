import express from 'express';
import log from '../services/log/api';
import auth from '../services/auth/api';
import rbac from '../services/auth/roleApi';
import civicApi from '../services/civic/api';
import timeout from "connect-timeout";
const config = require('../config');
const pJson = require('../../package.json');
const router = express.Router();

function allowAnon (req, res, next) {
    if(!req.headers.authorization) req.headers.authorization = 'bearer anon';
    return next();
}

router.get('/version', function(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.json( {
        err: null,
        message: {
            service: 'MailMyVoice.com Civic Proxy Service',
            implementer: config.IMPLEMENTER,
            git: 'https://github.com/UnitedEffects/UE-Civic-API_Srvc',
            version: pJson.version,
            currentMaintainers: pJson.contributors,
            baseURL: '/api',
            copyright: 'Copyright (c) 2019 theBoEffect LLC DBA United Effects'
        }
    });
});

router.get('/civic/representatives', [timeout(25000), allowAnon, auth.isOptionalAuthenticated, haltOnTimedout], civicApi.getReps);
router.get('/img', [allowAnon, auth.isOptionalAuthenticated], civicApi.img);

// Log and Health
router.get('/logs', [auth.isBearerAuthenticated, rbac.middleAny], log.getLogs);
router.get('/logs/:code', [auth.isBearerAuthenticated, rbac.middleAny], log.getLogByCode);
router.get('/logs/:code/:timestamp', [auth.isBearerAuthenticated, rbac.middleAny], log.getLog);
router.post('/logs', [auth.isBearerAuthenticated, rbac.middleAny], log.writeLog);
router.get('/health', function(req, res){
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.json({data: {server: 'running'}});
});

function haltOnTimedout(req, res, next){
    if (!req.timedout) next();
}

export default router;