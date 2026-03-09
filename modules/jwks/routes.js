import controller from './controller.js';
import authMiddleware from '../../middleware/auth.js';

const auth = { preHandler: [authMiddleware] }

export default async function (route) {
    route.get('/', controller.getData);
    route.post('/', auth, controller.createData);
}
