import axios from 'axios';
import uuid from 'uuidv4';
import send from '../response';
import helper from '../helper';
import Civic from './model';

const config = require('../../config');

async function queryRoles (array) {
    let newRoles = "";
    await Promise.all(array.map((role) => {
        newRoles = `${newRoles}&roles=${role}`
    }));
    return newRoles;
}

export default {
    async getReps(query, roles) {
        const address = uuid.fromString(query.address);
        const lookUp = await Civic.findOne({ address, roles });
        if(lookUp) return send.set200(lookUp.data, 'Representatives');
        const qRoles = await queryRoles(roles);
        const civicLookUp = await axios.get(
            `${config.CIVIC_API}?address=${query.address}${qRoles}&key=${config.CIVIC}`,
            {
                headers: {
                    name: 'Accept',
                    value: 'application/json'
                }
            }
        );
        if(!civicLookUp) throw send.fail400('There was a problem with the civic api proxy request');
        if(civicLookUp.status !== 200) return send.set(civicLookUp.status, civicLookUp.data, 'Representatives');
        const data = (helper.isJson(civicLookUp.data)) ? JSON.parse(civicLookUp.data) : JSON.parse(JSON.stringify(civicLookUp.data));
        if(data.offices) {
            await Promise.all(data.offices.map(async (office) => {
                await Promise.all(office.officialIndices.map((index) => {
                    data.officials[index]["office"] = office.name;
                    data.officials[index]["division"] = data.divisions[office.divisionId].name;
                }))
            }))
        }
        const civic = new Civic({
            address,
            roles,
            data
        });
        const savedData = await civic.save();
        return send.set200(savedData.data, 'Representatives');
    }
}