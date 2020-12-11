import React, { useState, useRef } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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

// let globalPhotoURL = "";

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

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
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

function ChatRoom() {
  const dummy = useRef();

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "desc").limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    //normally when a form is submitted it refreshes the page, but this prevents it
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        <div>
          {messages &&
            messages
              .sort((a, b) => a.createdAt > b.createdAt)
              .map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </div>
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">🕊️</button>
      </form>
    </>
  );
}

let users = [];
let colors = [
  "#00a8ff",
  "#9c88ff",
  "#fbc531",
  "#4cd137",
  "#487eb0",
  "#e84118",
  "#273c75",
];

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  // globalPhotoURL = photoURL;

  const messagesClass = uid === auth.currentUser.uid ? "sent" : "received";

  if (!users.includes((user) => user.uid === uid)) {
    users.push({
      uid: uid,
      i: Math.floor(Math.random() * 7),
    });
  }
  let thisUser = users.find((user) => user.uid === uid);
  let bg = {
    "--rec": colors[thisUser.i],
  };

  return (
    <>
      <div className={`message ${messagesClass}`} style={bg}>
        <img src={photoURL} alt="pic" />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
