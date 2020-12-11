import React from "react";

let users = [];
let colors = [
  "#00a8ff",
  "#9c88ff",
  "#fbc531",
  "#4cd137",
  "#487eb0",
  "#e84118",
  "#273c75",
  "#eccc68",
  "#ff7f50",
  "#ff6b81",
  "#a4b0be",
];

function ChatMessage(props) {
  const { auth } = props;
  const { text, uid, photoURL } = props.message;

  const messagesClass = uid === auth.currentUser.uid ? "sent" : "received";

  if (users.findIndex((user) => user.uid === uid) === -1) {
    users.push({
      uid: uid,
      colorIndex: getColorIndex(0),
    });
  }
  let thisUser = users.find((user) => user.uid === uid);
  let bg = {
    "--rec": colors[thisUser.colorIndex],
  };

  return (
    <>
      <div className={`message ${messagesClass}`} style={bg}>
        <img src={photoURL} alt="pic" />
        <p>
          <span>{text}</span>
        </p>
      </div>
    </>
  );
}

function getColorIndex(i) {
  i++;
  if (i > 3) return 0;
  let isPresent = 0;
  let index = Math.floor(Math.random() * colors.length);
  users.forEach((user) => {
    if (user.colorIndex === index) {
      isPresent = 1;
    }
  });
  if (isPresent) {
    getColorIndex();
  }
  return index;
}

export default ChatMessage;
