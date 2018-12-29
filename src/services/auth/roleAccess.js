import Access from 'accesscontrol';
import config from '../../config';

const ac = new Access();

ac.grant(['guest'])
    .readAny('img')
    .readAny('civic');

ac.grant(['productAdmin', 'domainAdmin'])
    .extend('guest');

ac.grant(['superAdmin'])
    .extend('guest')
    .createAny('logs')
    .updateAny('logs')
    .readAny('logs')
    .deleteAny('logs');

export default ac;