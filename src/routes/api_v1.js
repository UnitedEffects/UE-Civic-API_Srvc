// var express = require('express');
// var authApi = require('../services/auth/controller/api');
// var receiptApi = require('../services/receipt/controller/api');
// var stripeApi = require('../services/stripe/controller/api');
// var helper = require('../services/helper');
// var config = require('../config');
// var router = express.Router();
// var logApi = require('../services/log/controller/api');
//
// /* GET api listing. */
// router.get('/', function(req, res, next) {
//     res.json( {
//         err: null,
//         message: {
//             api: 'UE-PC-Payment_Srvc',
//             version: '1.0.0',
//             baseURL: '/api',
//             copyright: 'Copyright (c) 2017 theBoEffect LLC'
//         }
//     });
// });
//
// //Payment API
// router.post('/payment/test', function(req, res){
//     res.json(req.body);
// });
// router.post('/payment/charge', authApi.isChainedSocialBearer, stripeApi.charge);
//
// //WEBHOOKED EVENTS ARE NOT IMPLEMENTED AT THIS TIME AS THERE IS NO NEED - THIS IS A PLACEHOLDER FOR POTENTIAL FUTURE FEATURES
// //router.post('/payment/connect', stripeApi.webhook); //Secret Code Only
//
// router.get('/payment/receipts', authApi.isChainedSocialBearer, receiptApi.getReceipts); //admin only
// router.get('/payment/receipts/owner/:id', authApi.isChainedSocialBearer, receiptApi.getReceiptByOwner); //admin only
// router.get('/payment/receipts/me', authApi.isChainedSocialBearer, receiptApi.getReceiptByOwnerMe); //owner only
// router.get('/payment/receipts/postcard/:id', authApi.isChainedSocialBearer, receiptApi.getReceiptByPostcard) //admin only
// router.get('/payment/receipt/:id', authApi.isChainedSocialBearer, receiptApi.getReceipt); //admin or if owner
//
// //Lob Secrets
// router.get('/payment/secret', authApi.isChainedSocialBearer, stripeApi.getSecrets); //admin only
// router.get('/payment/secrets', authApi.isChainedSocialBearer, stripeApi.getSecretsHistory); //admin only
// router.post('/payment/secret', authApi.isChainedSocialBearer, stripeApi.setSecret); //admin only
// router.get('/payment/secret/test', function(req, res){
//     res.json({
//         secret: process.env.SECRET,
//         webhook: process.env.WEBHOOK
//     });
// });
//
// //logs
// router.get('/log/definitions', authApi.isChainedSocialBearer, logApi.logDefinitions);
// router.post('/log', authApi.isChainedSocialBearer, logApi.newLog);
// router.get('/logs', authApi.isChainedSocialBearer, logApi.returnLogs);
// router.post('/logs/range', authApi.isChainedSocialBearer, logApi.returnRange);
// router.get('/logs/:code', authApi.isChainedSocialBearer, logApi.returnByCode);
// router.get('/log/search', authApi.isChainedSocialBearer, logApi.search);
//
// //healthcheck
// router.get('/health', function(req, res){
//     res.json({err: null, data: {server: 'running'}});
// });
// router.get('/health/admin', authApi.isChainedSocialBearer, function(req, res){
//     if(req.user.role!=1) res.status(401).send('Unauthorized');
//     res.json({err: null, data: {server: 'running', mongo: helper.mongoStatus()}});
// });
//
//
//
// module.exports = router;