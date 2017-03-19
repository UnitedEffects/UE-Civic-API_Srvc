var express = require('express');
var authApi = require('../services/auth/controller/api');
var civicApi = require('../services/civic/controller/api');
var helper = require('../services/helper');
var config = require('../config');
var router = express.Router();
var logApi = require('../services/log/controller/api');

/* GET api listing. */
router.get('/', function(req, res, next) {
    res.json( {
        err: null,
        message: {
            api: 'UE-Civic-API_Srvc',
            version: '1.0.0',
            baseURL: '/api',
            copyright: 'Copyright (c) 2017 theBoEffect LLC'
        }
    });
});

//Payment API
router.get('/civic/representatives', authApi.isChainedSocialBearer, civicApi.getReps);
router.get('/img', authApi.isChainedSocialBearer, civicApi.img);

//logs
router.get('/log/definitions', authApi.isChainedSocialBearer, logApi.logDefinitions);
router.post('/log', authApi.isChainedSocialBearer, logApi.newLog);
router.get('/logs', authApi.isChainedSocialBearer, logApi.returnLogs);
router.post('/logs/range', authApi.isChainedSocialBearer, logApi.returnRange);
router.get('/logs/:code', authApi.isChainedSocialBearer, logApi.returnByCode);
router.get('/log/search', authApi.isChainedSocialBearer, logApi.search);

//healthcheck
router.get('/health', function(req, res){
    res.json({err: null, data: {server: 'running'}});
});
router.get('/health/admin', authApi.isChainedSocialBearer, function(req, res){
    res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
});



module.exports = router;