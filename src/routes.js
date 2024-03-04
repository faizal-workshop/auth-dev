const route = require('./fastify');
const auth = { preHandler: [require('../middleware/auth')] };
const defaultController = require('../controller');
const authController = require('../controller/auth');

// Routes start here

route.get('/', defaultController.root);
route.get('/health-check', defaultController.healthCheck);

route.post('/login', authController.login);
route.post('/register', authController.register);
route.get('/check-token', authController.checkToken);

route.get('/user', auth, authController.getUser);
route.get('/user/:id', auth, authController.getUserId);
route.patch('/user/:id', auth, authController.updateUser);
route.delete('/user', auth, authController.deleteUser);
route.delete('/user/:id', auth, authController.deleteUserId);

// End of routes

module.exports = route;
