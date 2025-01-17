import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBNpdwtM0epML1QSauI9w2M78As6FFfRFE",
  authDomain: "nano-ecommerce.firebaseapp.com",
  projectId: "nano-ecommerce",
  storageBucket: "nano-ecommerce.appspot.com",
  messagingSenderId: "857600008772",
  appId: "1:857600008772:web:a8e22412f5287c2ee9d211",
  measurementId: "G-9XYY8FPL41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)