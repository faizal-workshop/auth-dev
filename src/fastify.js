const fastify = require('fastify');
const path = require('path');

const app = fastify({
    logger: true,
    disableRequestLogging: true
});

app.register(require('@fastify/helmet'), {
    contentSecurityPolicy: false,
});

app.register(require('@fastify/rate-limit'), {
    max: 10,
    timeWindow: 1000,
});

app.register(require('@fastify/static'), {
    root: path.join(__dirname, '../view'),
});

app.register(require('@fastify/static'), {
    root: path.join(__dirname, '../node_modules'),
    prefix: '/static/',
    decorateReply: false,
});

app.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs'),
    },
});

module.exports = app;
