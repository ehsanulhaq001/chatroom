import React, { useRef, useState } from "react";
import firebase from "firebase/app";
import ChatMessage from "./chatmessage.js";

import { useCollectionData } from "react-firebase-hooks/firestore";

// let gDummy;
// window.onload = function () {
//   setInterval(gDummy.current.scrollIntoView(), 1000);
// };
let never = 1;

function ChatRoom(props) {
  const { firestore, auth } = props;
  const dummy = useRef();
  // gDummy = dummy;
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "asc");
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

    dummy.current.scrollIntoView();
  };

  return (
    <>
      <main onChange={runThis()}>
        <div>
          {messages &&
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} auth={auth} />
            ))}
        </div>
        <div id="hhh" ref={dummy}></div>
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

function runThis() {
  if (never) {
    setInterval(() => {
      document.getElementById("hhh").scrollIntoView();
    }, 1000);
    never = 0;
  }
}

export default ChatRoom;
