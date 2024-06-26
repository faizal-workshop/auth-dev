const { APP_NAME } = require('../src/configs');
const model = require('../model');

module.exports = {
    root: async (req, res) => {
        return await res.status(200).view('./view/index.ejs', {
            app_name: APP_NAME,
        });
    },
    documentation: async (req, res) => {
        const documentation = await model.documentation();

        documentation.forEach((item) => {
            if (item.body) item.body = JSON.parse(item.body);
            if (item.response) item.response = JSON.parse(item.response);
        });

        return await res.status(200).view('./view/documentation.ejs', {
            app_name: APP_NAME,
            documentation,
        });
    },
    robotsTxt: async (req, res) => {
        const robotsTxtContent = `User-agent: *\nDisallow: /`;

        return res.status(200)
            .header('Content-Type', 'text/plain')
            .send(robotsTxtContent);
    },
    healthCheck: async (req, res) => {
        return await res.status(200).send({
            application: APP_NAME,
            message: 'Application is healthy.',
        });
    },
    notFound: async (req, res) => {
        return await res.status(404).view('./view/notfound.ejs', {
            app_name: APP_NAME,
        });
    },
}
