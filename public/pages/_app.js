import '../styles/globals.css';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {Timestamp, addDoc, collection, setDoc, doc} from "firebase/firestore";
//import { onAuthStateChanged } from 'firebase/auth';
import Login from "./login.js"
import Loading from "../components/Loading"
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user){
      try{
        const docRef = setDoc(doc(db, "users", user.uid), {
          email: user.email,
          lastSeen: Timestamp.now(),
          photoURL: user.photoURL,
        });
        //,{ merge: true }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }, [user])

  if(loading) return <Loading />

  if (user)
    return <Component {...pageProps} />
  else  
    return <Login />
}

/*
function MyApp({ Component, pageProps }) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      return <Component {...pageProps} />
    } else {
      return <Login />
    }
  });
}
*/

export default MyApp;
