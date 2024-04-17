const route = require('./fastify');
const auth = { preHandler: [require('../middleware/auth')] };
const defaultController = require('../controller');
const authController = require('../controller/auth');
const jwksController = require('../controller/jwks');

// Routes start here

route.get('/', defaultController.root);
route.get('/documentation', defaultController.documentation);
route.get('/health-check', defaultController.healthCheck);

route.post('/register', authController.registerEmail);
route.post('/login', authController.loginEmail);
route.post('/check-token', authController.checkToken);

route.patch('/user/:id', auth, authController.updateUser);
route.delete('/user/:id', auth, authController.deleteUser);

route.get('/jwks', jwksController.getData);
route.post('/jwks', auth, jwksController.createData);

route.setNotFoundHandler(defaultController.notFound);

// End of routes

module.exports = route;
