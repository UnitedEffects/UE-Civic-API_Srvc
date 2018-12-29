/**
 * Created by borzou on 3/18/17.
 */
var respond = require('../../helper');
var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('../../log/controller/log'));
var send = require('../../callback');
var civic = Promise.promisifyAll(require('./civic'));
var request = Promise.promisify(require('request'));

var civicApi = {
    getReps: function(req, res){
        if(!req.query.address) return respond.sendJson(res, send.fail417("Address is a required field"));
        var newRoles = "";
        console.log(req.query.roles);
        if(typeof req.query.roles === 'string') {
            req.query.roles = req.query.roles.replace(/ /g,"");
        }
        civic.returnRoleArrayAsync(req.query)
            .each(function(role){
                newRoles = newRoles+"&roles="+role;
                return newRoles;
            })
            .then(function(output){
                return civic.findAddressAsync(req.query.address, newRoles)
            })
            .then(function(output){
                if(!output) {
                    return civic.getFromCivicAsync(req.query, newRoles);
                }
                return output;
            })
            .then(function(output){
                if(!output) return respond.sendJson(res, send.fail500("Unknown error, please try again later."));
                return respond.sendJson(res, output);
            })
            .catch(function(error){
                if(error.stack) console.log(error.stack);
                return respond.sendJson(res, error);
            });
    },
    img: function(req, res){
        if(!req.query.url) return respond.sendJson(res, send.fail417("url is a required field"));
        request.get({url: req.query.url}).pipe(res);
    }
};

module.exports = civicApi;