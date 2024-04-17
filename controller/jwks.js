const { APP_NAME } = require('../src/configs');
const model = require('../model/jwks');
const jwt = require('jsonwebtoken');

module.exports = {
    getData: async (req, res) => {
        const result = await model.getData();
        const jwkPublicKey = {
            kty: 'RSA',
            e: 'AQAB',
            n: result.split('\n').slice(1, -2).join(''),
        };

        return res.status(200).send({
            application: APP_NAME,
            message: 'Get JWKS success.',
            data: {
                keys: [jwkPublicKey],
            },
        });
    },
    createData: async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        const usertype = decoded.usertype;

        if (usertype !== 'administrator') {
            return res.status(403).send({
                application: APP_NAME,
                message: 'Invalid authentication token!',
            });
        }

        const result = await model.createData();
        const jwkPublicKey = {
            kty: 'RSA',
            e: 'AQAB',
            n: result.split('\n').slice(1, -2).join(''),
        };

        return res.status(201).send({
            application: APP_NAME,
            message: 'New keys generated and saved',
            data: {
                keys: [jwkPublicKey],
            },
        });
    },
}
