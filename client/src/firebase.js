import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBarZq6Xu7wUTjcgLYS5ysIGAJTReAXhoI",
    authDomain: "dx-workplace.firebaseapp.com",
    databaseURL: "https://dx-workplace.firebaseio.com",
    projectId: "dx-workplace",
    storageBucket: "dx-workplace.appspot.com",
    messagingSenderId: "909916765845",
    appId: "1:909916765845:web:26179e6c85973a456e659c",
    measurementId: "G-L4PL5EDMQK"
};

firebase.initializeApp(config);

export default firebase;