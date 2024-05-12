import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



var firebaseConfig = {
  apiKey: "AIzaSyC7AZXcCLy3z6eBgpMrxEzKj_YcZxDDFlU",
  authDomain: "healthhub-eab8d.firebaseapp.com",
  projectId: "healthhub-eab8d",
  storageBucket: "healthhub-eab8d.appspot.com",
  messagingSenderId: "390340029523",
  appId: "1:390340029523:web:154c248dbc7a1fe7822aa6",
  measurementId: "G-Y0FD5ZVJX9"
};
// Initialize Firebases
 firebase.initializeApp(firebaseConfig);

export default firebase;