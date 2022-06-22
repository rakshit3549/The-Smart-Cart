import { firebaseConfig } from '../config/config.js';

firebase.initializeApp(firebaseConfig());

var db = firebase.firestore();

var docRef = db.collection("Cart").doc("3550").
                collection("Data").doc("current_status");
docRef.onSnapshot((doc) => {
        if (doc.data().in_use){
            location.href = "cart.html";
        }
      });
