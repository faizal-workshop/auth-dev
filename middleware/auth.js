const { APP_NAME } = require('../src/configs');
const checkToken = require('../model/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if (token) {
        const error = checkToken(token);

        if (error) {
            return res.status(401).send({
                application: APP_NAME,
                message: error.message,
            });
        }

        next();
    } else {
        return res.status(401).send({
            application: APP_NAME,
            message: 'Missing authentication token!',
        });
    }
}
