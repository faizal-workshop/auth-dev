const route = require('./fastify');
const auth = { preHandler: [require('../middleware/auth')] };
const defaultController = require('../controller');
const authController = require('../controller/auth');

// Routes start here

route.get('/', defaultController.root);
route.get('/documentation', defaultController.documentation);
route.get('/health-check', defaultController.healthCheck);

route.post('/register', authController.registerEmail);
route.post('/login', authController.loginEmail);
route.post('/token', authController.checkToken);

route.setNotFoundHandler(defaultController.notFound);

// End of routes

module.exports = route;
