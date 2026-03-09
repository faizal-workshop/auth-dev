import { APP_NAME } from './configs.js';
import route from './fastify.js';

import defaultRoutes from '../modules/default/routes.js';
import authRoutes from '../modules/auth/routes.js';
import jwksRoutes from '../modules/jwks/routes.js';

// Modular routes start here

route.register(defaultRoutes);
route.register(authRoutes);
route.register(jwksRoutes, { prefix: '/jwks.json' });

route.setNotFoundHandler(async function (req, res) {
    return res.status(404).send({
        application: APP_NAME,
        message: 'Route or method not found!',
    });
});

// End of routes

export default route;
