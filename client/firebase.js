// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyApw789ADd9Skc-dqqvwQn19UU3MF6wNN0',
  authDomain: 'snap-sync-ba2d6.firebaseapp.com',
  projectId: 'snap-sync-ba2d6',
  storageBucket: 'snap-sync-ba2d6.appspot.com',
  messagingSenderId: '1056597225695',
  appId: '1:1056597225695:web:8263c1cc49eb79e96bf96a',
  measurementId: 'G-09X2C4G0HY'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);
export const storage = getStorage(app)
