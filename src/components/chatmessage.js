import React from "react";

//maintains list of users and their specified color in order
//to make their messages of same color but different from others

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

  //sets the class sent or received based on if the author is the current user or other

  const messagesClass = uid === auth.currentUser.uid ? "sent" : "received";

  //adds author of new message to the list of users and assigns a
  //new color to it if the user is not already present in the array

  if (users.findIndex((user) => user.uid === uid) === -1) {
    users.push({
      uid: uid,
      colorIndex: getColorIndex(0),
    });
  }

  //sets the message background based on the authors color from the users array

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
  //if the getColorIndex brings the same index 3 times colors[0]
  //is assigned in order to prevent call stack overflow

  i++;
  if (i > 3) return 0;
  let isPresent = 0;
  let index = Math.floor(Math.random() * colors.length);

  //checks if the index is already assigned to any user in users array

  users.forEach((user) => {
    if (user.colorIndex === index) {
      isPresent = 1;
      console.log("same");
    }
  });

  //calls again but passes the number of attempts

  if (isPresent) {
    getColorIndex(i);
  }
  return index;
}

export default ChatMessage;
