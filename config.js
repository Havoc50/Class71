import * as firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyAkFb_mMmqYt_0YWJ3ke4wVjBs2Gun_p1w",
  authDomain: "wireless-library-fc328.firebaseapp.com",
  projectId: "wireless-library-fc328",
  storageBucket: "wireless-library-fc328.appspot.com",
  messagingSenderId: "961112677154",
  appId: "1:961112677154:web:c240f48554a6f2ea9be37b"
};

firebase.initializeApp(firebaseConfig);

export default firebase.firestore();