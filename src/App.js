import React from "react";
import "./App.css";
import ChatRoom from "./components/chatroom.js";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";

firebase.initializeApp({
  apiKey: "AIzaSyDY_2ZTiAFXMZ-WSjFO_l-cvgInIJ-ROVw",
  authDomain: "chat-app-by-ehsan-64826.firebaseapp.com",
  projectId: "chat-app-by-ehsan-64826",
  storageBucket: "chat-app-by-ehsan-64826.appspot.com",
  messagingSenderId: "269161966106",
  appId: "1:269161966106:web:c6f310bfc249d5b4233fa3",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <div>
          <pre>my_chat_room__</pre>
        </div>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom firestore={firestore} auth={auth} /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="signOut" onClick={() => auth.signOut()}>
        {auth.currentUser && <img src={auth.currentUser.photoURL} alt="pic" />}
        Sign out
      </button>
    )
  );
}

export default App;
