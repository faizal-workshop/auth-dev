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

function nodeModulesPath(packagePath) {
    return join(__dirname, '..', 'node_modules', packagePath);
}

const app = fastify({
    logger: true,
    disableRequestLogging: true,
});

app.register(fastifyCors);

app.register(fastifyHelmet, {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-eval'"],
            frameAncestors: ["'none'"],
        },
    },
    crossOriginOpenerPolicy: {
        policy: 'same-origin-allow-popups',
    },
});

app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
});

app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/res/',
    decorateReply: false,
    wildcard: false,
});

const staticPaths = [
    {
        root: nodeModulesPath('alpinejs/dist'),
        prefix: '/static/alpinejs/',
    },
    {
        root: nodeModulesPath('bootstrap/dist'),
        prefix: '/static/bootstrap/',
    },
    {
        root: nodeModulesPath('@fortawesome/fontawesome-free'),
        prefix: '/static/fontawesome/',
    },
    {
        root: nodeModulesPath('@highlightjs/cdn-assets'),
        prefix: '/static/highlightjs/',
    },
];

staticPaths.forEach(({ root, prefix }) => {
    app.register(fastifyStatic, { root, prefix, decorateReply: false });
});

app.register(fastifyView, {
    engine: { ejs },
});

export default app;
