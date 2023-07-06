import firebase from 'firebase/compat/app';
// Required for side-effects
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

const firebaseConfig = {
	apiKey: 'AIzaSyDMeU9fbJ814uDP1kaPnbOVpdL5mdgO0Qs',
	authDomain: 'berouchim-habaim.firebaseapp.com',
	projectId: 'berouchim-habaim',
	storageBucket: 'berouchim-habaim.appspot.com',
	messagingSenderId: '759490695535',
	appId: '1:759490695535:web:a3e291a5c9359c6353589a',
	measurementId: 'G-P279M4E2J4'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let analytics;

// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();
if (typeof window !== 'undefined') {
  analytics = firebase.analytics();
}
export const analyticsRef = analytics;
