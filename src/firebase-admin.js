const admin = require('firebase-admin');
const {
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL
} = require('./configs');

const config = {
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL,
};

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(config),
});

module.exports = firebaseAdmin;
