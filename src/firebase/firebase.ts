import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBd-i0HluEP2GN59uCmOGt5vZRlpLeH80o',
  authDomain: 'healthabitify.firebaseapp.com',
  projectId: 'healthabitify',
  storageBucket: 'healthabitify.appspot.com',
  messagingSenderId: '160733277781',
  appId: '1:160733277781:web:19245b393c54a34e8eaedc',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
