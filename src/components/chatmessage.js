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
  const { text, uid, photoURL, createdAt } = props.message;

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
  let timestamp;
  let time = "";
  let date = "";
  let ampm = "am";
  if (createdAt) {
    timestamp = createdAt.toDate().toString().split(" ");
    time = timestamp[4].split(":").slice(0, 2); //xx:xx
    if (time[0] >= 12) {
      ampm = "pm";
      if (time[0] > 12) {
        time[0] -= 12;
      }
    }
    date = timestamp[2] + " " + timestamp[1];
  }

  return (
    <>
      <div className={`message ${messagesClass}`}>
        <img src={photoURL} alt="pic" />
        <div>
          <div className="textHolderHolder">
            <div className="textHolder" style={bg}>
              <span>{text}</span>
            </div>
          </div>
          <pre className="timeAndDate">
            {" " + time[0] + ":" + time[1] + " " + ampm + " " + date}
          </pre>
        </div>
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
