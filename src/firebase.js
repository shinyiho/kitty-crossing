import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA-FAm84N5-EWDsB7oa1e_C-2OUVpxfUTQ",
  authDomain: "kitty-crossing.firebaseapp.com",
  projectId: "kitty-crossing",
  storageBucket: "kitty-crossing.appspot.com",
  messagingSenderId: "49789784698",
  appId: "1:49789784698:web:59050f3c48fe0ffe4021c3",
  measurementId: "G-GBP1T167BD",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
