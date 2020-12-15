import React, { useRef, useState } from "react";
import firebase from "firebase/app";
import ChatMessage from "./chatmessage.js";
import { useCollectionData } from "react-firebase-hooks/firestore";

function ChatRoom(props) {
  const { firestore, auth } = props;
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt", "asc");
  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    //normally when a form is submitted it refreshes the page, but this prevents it

    e.preventDefault();

    //prevents user from spamming empty messages which increases the
    //total reads from database also trims down the uneccesary whitespaces

    if (!formValue.trim()) return;

    //adds data to the database

    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    //refreshes formvalue to empty

    setFormValue("");

    //deletes the firestore documents when collectoin length exceeds the limit
    //in order to reduce total reads afterwards writes and deletes go together

    let len = messages.length;
    let i = 0;
    while (len > 20) {
      firestore.collection("messages").doc(messages[i].id).delete();
      i++;
      len--;
    }

    //scrolls the page to bottom to see the typed new message

    dummy.current.scrollIntoView();
  };

  return (
    <>
      <main>
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

export default ChatRoom;
