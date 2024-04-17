require('dotenv').config();

module.exports = {
    APP_NAME: process.env.APP_NAME,
    PORT: process.env.PORT || 4000,
    IPBIND: process.env.IPBIND || '127.0.0.1',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
}
