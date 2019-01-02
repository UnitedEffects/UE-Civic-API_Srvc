import ac from './roleAccess';
import respond from '../responder';
import log from '../log/logs';
const config = require('../../config');

function getRole (user, domain) {
    try {
        const role = [];
        if(user.role===1) role.push('superAdmin');
        if(user.permissions) if(user.permissions.product) if(user.permissions.product[config.PRODUCT_SLUG]) {
            if(user.permissions.product[config.PRODUCT_SLUG].admin) role.push('productAdmin');
        }
        if(domain){
            if(user.permissions) if(user.permissions.domain) if(user.permissions.domain[domain]) {
                if(user.permissions.domain[domain].admin) role.push('domainAdmin');
            }
        }
        if(role.length===0) role.push('guest');
        return Promise.resolve(role);
    } catch (e) {
        return Promise.reject(e);
    }
}

function getDomain (req) {
    try {
        if(req.params.domain) return req.params.domain;
        if(req.query.domain) return req.query.domain;
        if(req.body.domain) return req.body.domain;
        if(req.headers.domain) return req.headers.domain;
        if(req.params.domain_slug) return req.params.domain_slug;
        if(req.query.domain_slug) return req.query.domain_slug;
        if(req.body.domain_slug) return req.body.domain_slug;
        if(req.headers.domain_slug) return req.headers.domain_slug;
        if(req.params.domainSlug) return req.params.domainSlug;
        if(req.query.domainSlug) return req.query.domainSlug;
        if(req.body.domainSlug) return req.body.domainSlug;
        if(req.headers.domainSlug) return req.headers.domainSlug;
        return undefined;
    } catch (e) {
        throw e;
    }
}

const roleApi = {
    async middleAny (req, res, next) {
        try {
            const roles = await getRole(req.user, getDomain(req));
            let resource = req.path.split('/')[1];
            if (resource === '') resource = 'root';
            let access = false;
            await Promise.all(roles.map((role) => {
                switch (req.method) {
                    case 'GET':
                        if (!access) {
                            if (ac.can(role).readAny(resource).granted) access = true;
                        }
                        break;
                    case 'PATCH':
                        if (!access) {
                            if (ac.can(role).updateAny(resource).granted) access = true;
                        }
                        break;
                    case 'PUT':
                        if (!access) {
                            if (ac.can(role).updateAny(resource).granted) access = true;
                        }
                        break;
                    case 'DELETE':
                        if (!access) {
                            if (ac.can(role).deleteAny(resource).granted) access = true;
                        }
                        break;
                    case 'POST':
                        if (!access) {
                            if (ac.can(role).createAny(resource).granted) access = true;
                        }
                        break;
                    default:
                        break;
                }
            }));
            if (access) return next();
            return respond.sendUnauthorized(res);
        } catch (error) {
            log.error(error);
            return respond.sendUnauthorized(res);
        }
    },
    async own (req, resourceOwner) {
        try {
            const roles = await getRole(req.user, getDomain(req));
            const userId = req.user._id;
            let resource = req.path.split('/')[1];
            if (resource === '') resource = 'root';
            let access = false;
            await Promise.all(roles.map((role) => {
                switch (req.method) {
                    case 'GET':
                        if (!access) {
                            if (ac.can(role).readOwn(resource).granted && userId === resourceOwner) access = true;
                        }
                        break;
                    case 'PATCH':
                        if (!access) {
                            if (ac.can(role).updateOwn(resource).granted && userId === resourceOwner) access = true;
                        }
                        break;
                    case 'PUT':
                        if (!access) {
                            if (ac.can(role).updateOwn(resource).granted && userId === resourceOwner) access = true;
                        }
                        break;
                    case 'DELETE':
                        if (!access) {
                            if (ac.can(role).deleteOwn(resource).granted && userId === resourceOwner) access = true;
                        }
                        break;
                    case 'POST':
                        if (!access) {
                            if (ac.can(role).createOwn(resource).granted && userId === resourceOwner) access = true;
                        }
                        break;
                    default:
                        break;
                }
            }));
            return access;
        } catch (error) {
            log.error(error);
            throw error;
        }
    },
};

export default roleApi;