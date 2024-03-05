const { APP_NAME } = require('../src/configs');
const documentation = require('../service/documentation');

module.exports = {
    root: (req, res) => {
        res.view('./view/index.ejs', { app_name: APP_NAME, documentation });
    },
    healthCheck: async (req, res) => {
        res.status(200).send({
            application: APP_NAME,
            message: 'Application is healthy.',
        });
    },
    notFound: async function (req, res) {
        return await res.view('./view/notfound.ejs', { app_name: APP_NAME });
    },
}
