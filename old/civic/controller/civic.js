/**
 * Created by borzou on 3/18/17.
 */
var Promise = require('bluebird');
var Log = Promise.promisifyAll(require('../../log/controller/log'));
var send = require('../../callback');
var request = Promise.promisify(require('request'));
var config = require('../../../config');
var helper = require('../../helper');
var Civic = Promise.promisifyAll(require('../model/civic'));

var civicFactory = {
    getFromCivic: function(query, roles, cb){
        if(!query.address) return cb(send.failErr("Address is required"), null);
        var myUrl = 'https://www.googleapis.com/civicinfo/v2/representatives?address='+query.address+roles+'&key='+config.civic;
        var options = {
            method: 'GET',
            uri: myUrl,
            headers:[
                {
                    name: 'Accept',
                    value: 'application/json'
                }
            ]
        };

        var output = {};

        request(options)
            .then(function(result){
                if(!result) return cb(send.failErr("Unknown issue with GoogleAPI Civic Service"), null);
                if(result.statusCode!=200) return cb(send.fail500(helper.isJson(result.body) ? JSON.parse(result.body) : result.body), null);
                output = (helper.isJson(result.body)) ? JSON.parse(result.body) : result.body;
                return output.offices;
            })
            .each(function(office){
                office.officialIndices.forEach(function(index){
                    output.officials[index]["office"] = office.name;
                    output.officials[index]["division"] = output.divisions[office.divisionId].name;
                    return office;
                })
            })
            .then(function(){
                var newAddress = {
                    address: query.address,
                    roles: roles,
                    data: output
                };
                civicFactory.saveAddress(newAddress, function(err, result){
                    if(err) {
                        console.log(err);
                        Log.error('Could not cache an address from civic api.', err);
                    }
                });
                return cb(null, send.success(output));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    findAddress: function(address, roles, cb){
        Civic.findOne({address: address, roles: roles})
            .then(function(result){
                if(!result) cb(null, null);
                return cb(null, send.success(JSON.parse(JSON.stringify(result.data))));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    saveAddress: function(address, cb){
        var civic = new Civic(address);
        civic.save()
            .then(function(result){
                return cb(null, send.success(result));
            })
            .catch(function(error){
                return cb(send.failErr(error), null);
            })
    },
    returnRoleArray: function(query, cb){
        if(!query) return cb(send.fail500("Unknown error"), null);
        var array = [];
        if(!query.roles) return cb(null, array);
        if(typeof query.roles === 'object') return cb(null, query.roles);
        var temp = query.roles.replace("[","");
        temp = temp.replace("]","");
        temp = temp.replace(/ /g,"");
        array = temp.split(",");
        return cb(null, array);
    }
};

module.exports = civicFactory;