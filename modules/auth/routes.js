import controller from './controller.js';
import authMiddleware from '../../middleware/auth.js';

const auth = { preHandler: [authMiddleware] }

export default async function (route) {
    route.post('/login', controller.login);
    route.post('/check-token', auth, controller.checkToken);
    route.post('/register', controller.createData);

    route.patch('/user', auth, controller.editData);
    route.delete('/user', auth, controller.deleteData);
}
