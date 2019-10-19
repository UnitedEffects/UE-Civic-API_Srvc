import axios from 'axios';
import responder from '../responder';
import log from '../log/logs';
import send from '../response';
import dal from './civic';

function returnRoleArray (query) {
    if(!query) return [];
    if(!query.roles) return [];
    if(typeof query.roles === 'object') return query.roles;
    return query.roles.replace('[', '').replace(']', '').replace(/ /g, '').split(',');
}

export default {
    async getReps (req, res) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        try {
            if(!req.query.address) return responder.send(res, send.fail400('Address is a required field'));
            const roleArray = returnRoleArray(req.query);
            console.info(roleArray);
            const reps = await dal.getReps(req.query, roleArray);
            return responder.send(res, reps);
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.info(error);
                log.error(error.message);
                return responder.send(res, send.set(503, error.message, 'Representatives',));
            }
            return responder.send(res, (error.code) ? error : send.error(error.message, 'Representatives'))
        }

    },
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