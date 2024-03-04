const { APP_NAME } = require('../src/configs');
const validateToken = require('../service/validateToken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if (token) {
        const error = validateToken(token);

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
