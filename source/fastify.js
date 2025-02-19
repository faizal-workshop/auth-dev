import fastify from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import ejs from 'ejs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const folderPath = join(__dirname, '..', 'public');
const dependencyPath = join(__dirname, '..', 'node_modules');

const app = fastify({
    logger: true,
    disableRequestLogging: true,
});

app.register(fastifyCors);

app.register(fastifyHelmet, {
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups',
    },
});

app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
});

app.register(fastifyStatic, {
    root: folderPath,
    prefix: '/res/',
    wildcard: false,
    defaultHeaders: {
        'Content-Type': {
            '.css': 'text/css',
            '.svg': 'image/svg+xml',
            '.js': 'application/javascript',
        }
    },
});

app.register(fastifyStatic, {
    root: dependencyPath,
    prefix: '/static/',
    decorateReply: false,
});

app.register(fastifyView, {
    engine: { ejs },
});

export default app;
