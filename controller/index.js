const { APP_NAME } = require('../src/configs');
const getDocs = require('../service/getDocs');

module.exports = {
    root: async (req, res) => {
        await res.view('./view/index.ejs', { app_name: APP_NAME });
    },
    documentation: async (req, res) => {
        const documentation = await getDocs();
        await res.view('./view/documentation.ejs', { app_name: APP_NAME, documentation });
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
