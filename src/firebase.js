import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBAu8k7rSZx3CwXm_0Ax5uvooNFFoOUMDw",
    authDomain: "insta-clone-react-3d1bb.firebaseapp.com",
    databaseURL: "https://insta-clone-react-3d1bb.firebaseio.com",
    projectId: "insta-clone-react-3d1bb",
    storageBucket: "insta-clone-react-3d1bb.appspot.com",
    messagingSenderId: "702155434169",
    appId: "1:702155434169:web:e5b74591ef301c3044d368",
    measurementId: "G-PP3PBHYBRE"
});
  


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export  {db, auth, storage};