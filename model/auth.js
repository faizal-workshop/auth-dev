const firebase = require('../src/firebase');
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} = require('firebase/auth');
const auth = getAuth(firebase);

module.exports = {
    registerEmail: async function (userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            return userCredential.user;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
    loginEmail: async function (userData) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password);
            return userCredential.user;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
};
