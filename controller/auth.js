const { APP_NAME, JWT_EXPIRATION } = require('../src/configs');
const model = require('../model/auth');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const keyFolderPath = path.join(__dirname, '..', '.keys');

module.exports = {
    registerEmail: async (req, res) => {
        const { email = '', password = '' } = req.body;

        if (!email || !password) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Email and password should be provided!',
            });
        }

        try {
            const userData = { email, password };
            const result = await model.registerEmail(userData);

            return res.status(200).send({
                application: APP_NAME,
                message: 'New user account registered successfully.',
                data: {
                    id: result.uid,
                    email: result.email,
                    createdAt: result.metadata.createdAt,
                },
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Register user account failed!',
            });
        }
    },
    loginEmail: async (req, res) => {
        const { email = '', password = '' } = req.body;

        if (!email || !password) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Email and password should be provided!',
            });
        }

        try {
            const keyPath = path.join(keyFolderPath, 'private.pem');
            const jwtSecret = fs.readFileSync(keyPath, 'utf8');
            const userData = { email, password };
            const result = await model.loginEmail(userData);
            const token = jwt.sign({
                id: result.uid,
                email: result.email,
            }, jwtSecret, { algorithm: 'RS256', expiresIn: JWT_EXPIRATION });

            return res.status(200).send({
                application: APP_NAME,
                message: 'Login with email success.',
                data: token,
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Login with email failed, please try again!',
            });
        }
    },
    checkToken: async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Missing authentication token!',
            });
        }

        try {
            const keyPath = path.join(keyFolderPath, 'private.pem');
            const jwtSecret = fs.readFileSync(keyPath, 'utf8');
            const verify = jwt.verify(token, jwtSecret, { algorithms: ['RS256'] });
            const expirationTime = verify.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const remainingTimeInSeconds = expirationTime - currentTimeInSeconds;
            const remainingTime = {
                hours: Math.floor(remainingTimeInSeconds / 3600),
                minutes: Math.floor((remainingTimeInSeconds % 3600) / 60),
                seconds: remainingTimeInSeconds % 60,
            };

            return res.status(201).send({
                application: APP_NAME,
                message: 'Token is valid.',
                data: {
                    remainingTime,
                    payload: verify,
                    token,
                },
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Token is invalid!',
            });
        }
    },
}
