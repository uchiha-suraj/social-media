import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCDcecHvXg9sgGYCzWy-JdCdFjH69jad5w",
    authDomain: "instagram-a719d.firebaseapp.com",
    projectId: "instagram-a719d",
    storageBucket: "instagram-a719d.appspot.com",
    messagingSenderId: "896110295087",
    appId: "1:896110295087:web:e1c91753235c1a787f2eda"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };