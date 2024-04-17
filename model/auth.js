const firebase = require('../src/firebase');
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
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            const meta = doc(db, 'usermeta', userCredential.user.uid);
            const addUsertype = await setDoc(meta, {
                name: userData.name || 'User',
                usertype: 'user',
            });

            return {
                id: userCredential.user.uid,
                name: userData.name || 'User',
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
            const meta = doc(db, 'usermeta', userCredential.user.uid);
            const metaSnap = await getDoc(meta);
            const metaData = metaSnap.data();

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
};
