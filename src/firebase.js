import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCvcat_9KBltzs4S5nRRiewj7zmQMDwGvo",
  authDomain: "linkedin-clone-b8ce3.firebaseapp.com",
  projectId: "linkedin-clone-b8ce3",
  storageBucket: "linkedin-clone-b8ce3.appspot.com",
  messagingSenderId: "291196890298",
  appId: "1:291196890298:web:620217bd0d4513cbf6a683",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const provider = new firebase.auth.GoogleAuthProvider()
const storage = firebase.storage()

export {auth, provider, storage}
export default db
