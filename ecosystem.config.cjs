require('dotenv').config();
const packageJson = require('./package.json');

module.exports = {
    apps: [
        {
            name: packageJson.name,
            script: 'src/app.js',
            env: {
                HOST: process.env.IPBIND || '127.0.0.1',
                PORT: parseInt(process.env.PORT) || 3000,
                BODY_SIZE_LIMIT: process.env.SIZE_LIMIT || '10M',
            },
        },
    ]
};
