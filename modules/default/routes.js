import controller from './controller.js';

export default async function (route) {
    route.get('/', controller.root);
    route.get('/documentation', controller.documentation);
    route.get('/robots.txt', controller.robotsTxt);
}
