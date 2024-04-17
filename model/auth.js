const firebaseAdmin = require('../src/firebase-admin');
const firebase = require('../src/firebase');
const adminAuth = firebaseAdmin.auth();
const adminDb = firebaseAdmin.firestore();
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} = require('firebase/auth');
const {
    getFirestore,
    setDoc,
    getDoc,
    doc,
} = require('firebase/firestore');
const auth = getAuth(firebase);
const db = getFirestore(firebase);

module.exports = {
    registerEmail: async function (userData) {
        try {
            const registeredUsername = userData.name || 'Registered User';
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const meta = adminDb.collection('usermeta').doc(userCredential.user.uid);

            await meta.set({
                name: registeredUsername,
                usertype: 'user',
            });

            return {
                id: userCredential.user.uid,
                name: registeredUsername,
                email: userCredential.user.email,
                usertype: 'user',
                createdAt: userCredential.user.metadata.createdAt,
            }
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
    loginEmail: async function (userData) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            const meta = await adminDb.collection('usermeta').doc(userCredential.user.uid).get();
            const metaData = meta.data();

            return {
                id: userCredential.user.uid,
                name: metaData.name,
                email: userCredential.user.email,
                usertype: metaData.usertype,
            };
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
    updateUser: async function (userId, userData) {
        const { name = '', email = '', password = '' } = userData;

        try {
            if (email) await adminAuth.updateUser(userId, { email });
            if (password) await adminAuth.updateUser(userId, { password });
            if (name) {
                const meta = adminDb.collection('usermeta').doc(userId);
                await meta.set({ name }, { merge: true });
            }

            const userInfo = await adminAuth.getUser(userId);
            const meta = await adminDb.collection('usermeta').doc(userId).get();
            const metaData = meta.data();

            return {
                id: userInfo.uid,
                name: metaData.name,
                email: userInfo.email,
                usertype: metaData.usertype,
            };
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
    deleteUser: async function (userId) {
        try {
            const usermeta = adminDb.collection('usermeta').doc(userId);

            await usermeta.delete();
            await adminAuth.deleteUser(userId);

            return true;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
};
