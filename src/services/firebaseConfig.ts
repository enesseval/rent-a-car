import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
   apiKey: "AIzaSyDQtxV7_XXdcVgYiqYoYss6uCudWGKQiR4",
   authDomain: "rent-a-car-13711.firebaseapp.com",
   projectId: "rent-a-car-13711",
   storageBucket: "rent-a-car-13711.appspot.com",
   messagingSenderId: "331548338027",
   appId: "1:331548338027:web:6c54ef9fb4cc00fb784e2e",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
   .then()
   .catch((e) => console.log("Error setting persistence: ", e));

export { auth };
