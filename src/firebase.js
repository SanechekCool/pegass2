import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAg9SrVMzVNpJnEm4fEUWxflS3fbYkogOM",
    authDomain: "pegass-7f44f.firebaseapp.com",
    databaseURL: "https://pegass-7f44f.firebaseio.com/",
    projectId: "pegass-7f44f",
    storageBucket: "pegass-7f44f.appspot.com",
    messagingSenderId: "256843655520",
    appId: "1:256843655520:web:bcc3701207e23d05265605"
}

require("firebase/firestore");

const app = firebase.initializeApp(config);

export const firestore = app.firestore();
export const storageImagesRef = app.storage().ref().child('images');
export const usersRef = app.firestore().collection("users");
export const dialogsRef = app.firestore().collection("dialogs");
export const auth = app.auth();
