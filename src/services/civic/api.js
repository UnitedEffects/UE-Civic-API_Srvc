import axios from 'axios';
import responder from '../responder';
import send from '../response';
import dal from './civic';
import log from "../log/logs";

function returnRoleArray (query) {
    if(!query) return [];
    if(!query.roles) return [];
    if(typeof query.roles === 'object') return query.roles;
    return query.roles.replace('[', '').replace(']', '').replace(/ /g, '').split(',');
}

export default {
    async getReps (req, res) {
        try {
            if(!req.query.address) return responder.send(res, send.fail400('Address is a required field'));
            const roleArray = returnRoleArray(req.query);
            let newRoles = "";
            await Promise.all(roleArray.map((role) => {
                newRoles = `${newRoles}&roles=${role}`
            }));
            const reps = await dal.getReps(req.query, newRoles); //todo <-- write this code in DAL
            return responder.send(res, reps);
        } catch (error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Representatives'))
        }

    },
    // getReps_old: function(req, res){
    //     if(!req.query.address) return respond.sendJson(res, send.fail417("Address is a required field"));
    //     var newRoles = "";
    //     console.log(req.query.roles);
    //     if(typeof req.query.roles === 'string') {
    //         req.query.roles = req.query.roles.replace(/ /g,"");
    //     }
    //     civic.returnRoleArrayAsync(req.query)
    //         .each(function(role){
    //             newRoles = newRoles+"&roles="+role;
    //             return newRoles;
    //         })
    //         .then(function(output){
    //             return civic.findAddressAsync(req.query.address, newRoles)
    //         })
    //         .then(function(output){
    //             if(!output) {
    //                 return civic.getFromCivicAsync(req.query, newRoles);
    //             }
    //             return output;
    //         })
    //         .then(function(output){
    //             if(!output) return respond.sendJson(res, send.fail500("Unknown error, please try again later."));
    //             return respond.sendJson(res, output);
    //         })
    //         .catch(function(error){
    //             if(error.stack) console.log(error.stack);
    //             return respond.sendJson(res, error);
    //         });
    // },
    async img (req, res) {
        try {
            if(!req.query.url) return responder.send(res, send.fail400('URL is a required field'));
            const response = await axios.get({
                url: req.query.url,
                responseType:'stream'
            });
            return response.data.pipe(res);
        } catch (error) {
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Image'))
        }
    }
};