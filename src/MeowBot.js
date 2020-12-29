import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import firebase from "firebase";

const MeowBot = () => {
  const messageEl = useRef(null);
  const [messages, setmessages] = useState([]); //store all the messages
  const [input, setinput] = useState(""); //show word in the input space
  const [response, setresponse] = useState("");
  let responding;
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);
  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setmessages(snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() })));
      });
    return () => {
      unsubscribe();
    };
  }, []);
  //should wait for searchResponseSen state change and add it to db
  useEffect(() => {
    if (response) {
      responding = setTimeout(() => {
        db.collection("messages").add({
          text: response,
          user: "cat",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setresponse("");
      }, Math.random() * 5000);
      return () => {
        clearTimeout(responding);
      };
    }
  }, [response]);
  //searchResponseSen and add user text to db
  const handlesend = (e) => {
    e.preventDefault();
    db.collection("messages").add({
      text: input,
      user: "user",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    searchResponseSen(input);
    setinput("");
  };
  let searchResponseSen = (input) => {
    fetch("https://kitty-chatting-api.herokuapp.com/message")
      .then((response) => response.json())
      .then((data) => {
        let responseSen;
        data.forEach((jsoncase) => {
          for (let i = 0; i < jsoncase.requestContain.length; i++) {
            if (input.includes(jsoncase.requestContain[i])) {
              responseSen = jsoncase.responseSen;
            }
          }
          if (!responseSen) {
            responseSen = "meow";
          }
        });
        setresponse(responseSen);
      });
  };

  return (
    <div className="meowbot">
      <div className="messages" ref={messageEl}>
        {messages.map(({ id, message }) =>
          message.user === "cat" ? (
            <p key={id} className="catmessages">
              {`${message.text} `}
            </p>
          ) : (
            <p key={id} className="usermessages">
              {`${message.text} `}
            </p>
          )
        )}
      </div>
      <form className="inputtext">
        <input value={input} className="text_area" type="text" onChange={(e) => setinput(e.target.value)} />
        <button className="send_area" onClick={handlesend}>
          send
        </button>
      </form>
    </div>
  );
};

export default MeowBot;
