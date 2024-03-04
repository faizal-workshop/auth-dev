const { APP_NAME } = require('../src/configs');

module.exports = {
    root: (req, res) => {
        res.view('./view/html/index.ejs', { app_name: APP_NAME });
    },
    healthCheck: async (req, res) => {
        res.status(200).send({
            application: APP_NAME,
            message: 'Application is healthy.',
        });
    },
}
