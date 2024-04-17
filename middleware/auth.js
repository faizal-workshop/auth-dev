const { APP_NAME } = require('../src/configs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    const keyFolderPath = path.join(__dirname, '..', '.keys');
    const keyPath = path.join(keyFolderPath, 'public.pem');
    const jwtSecret = fs.readFileSync(keyPath, 'utf8');

    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        const verify = jwt.verify(token, jwtSecret, (e, decoded) => {
            if (e) {
                console.error(e);

                return res.status(401).send({
                    application: APP_NAME,
                    message: 'Invalid authentication token!',
                });
            }
        });

        next();
    } else {
        return res.status(401).send({
            application: APP_NAME,
            message: 'Missing authentication token!',
        });
    }
}
