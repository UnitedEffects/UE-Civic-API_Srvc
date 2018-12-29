import Access from 'accesscontrol';
import config from '../../config';

const ac = new Access();

ac.grant(['guest'])
    .createAny('payment')
    .readAny('my')
    .readOwn('payment');

ac.grant(['productAdmin', 'domainAdmin'])
    .extend('guest')
    .readAny('payment');

ac.grant(['superAdmin'])
    .extend('guest')
    .createAny('logs')
    .updateAny('logs')
    .readAny('logs')
    .deleteAny('logs')
    .readAny('payment');

export default ac;