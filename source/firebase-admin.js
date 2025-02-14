import {
    FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL
} from './configs.js';
import admin from 'firebase-admin';

const config = {
    projectId: FIREBASE_PROJECT_ID,
    privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: FIREBASE_CLIENT_EMAIL,
}

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(config),
});

export default firebaseAdmin;
