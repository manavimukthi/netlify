// Firebase initializer (exports auth and firestore instances)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAj_VYQGeslr9o78RNsvO_hRqZgIRWOyVs",
  authDomain: "ceyliz-platform.firebaseapp.com",
  projectId: "ceyliz-platform",
  storageBucket: "ceyliz-platform.firebasestorage.app",
  messagingSenderId: "48516212241",
  appId: "1:48516212241:web:60368aca10410f93f3f3b0",
  measurementId: "G-K9G0F8E5GV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
