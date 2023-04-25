import { useState, useEffect, useMemo } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase-config";

import '../styles/chat.scss';

export const Chat = (props) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessage] = useState([]);
  const [time, setTime] = useState([]);
  const { room, signUserOut } = props;
  // console.log(room, signUserOut)
  const messagesRef = collection(db, 'messages'); // get collection orders from firestore

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === '') return;


    /* I add an object with a message to the message collection, serverTimestamp is the 
    time of sending the message, a method from the library */
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,

    });

    setNewMessage('');
  };

  useEffect(() => {
    // gets all messages with room name from props
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy('createdAt') // need to connect with using method query and add index in firesore 
    );

    // listening all changes for queryMessages
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let newMessages = [];
      snapshot.forEach((doc) => {
        newMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessage(newMessages);

      if (newMessages[newMessages.length - 1].createdAt) {
        setTime(newMessages.map(item => {
          return {
            minutes: new Date(item.createdAt.seconds * 1000).getMinutes(),
            hours: new Date(item.createdAt.seconds * 1000).getHours(),
            date: new Date(item.createdAt.seconds * 1000).getDate(),
            month: new Date(item.createdAt.seconds * 1000).getMonth(),
            year: new Date(item.createdAt.seconds * 1000).getFullYear(),
          };
        }));
      }
    });

    return () => unsuscribe();
    // eslint-disable-next-line
  }, []);

  const showMessages = useMemo(() => {
    return messages.map((item, i) => {
      let hours = time[i].hours.length > 1 ? time[i].hours : `0${time[i].hours}`;
      let minutes = time[i].minutes.length > 1 ? time[i].minutes : `0${time[i].minutes}`;
      let date = time[i].date.length > 1 ? time[i].date : `0${time[i].date}`;
      let month = time[i].month.length > 1 ? time[i].month : `0${time[i].month}`;
      let year = time[i].year.length > 1 ? time[i].year : `0${time[i].year}`;

      if (auth.currentUser.displayName === item.user) {
        return (
          <div className="messages__currentUser messages__item" key={item.id}>
            <span className="messages__user messages__user_currentUser">Me</span>
            <span className="messages__text">{item.text}</span>
            {
              time[i].hours ?
              (<span className="messages__time messages__time_currentUser">
                {
                  `${hours.length > 2 ? hours.slice(1) : hours}:${minutes.length > 2 ? minutes.slice(1) : minutes}  -  
                  ${date.length > 2 ? date.slice(1) : date}/${month.length > 2 ? month.slice(1) : month}/${year.length > 2 ? year.slice(1) : year}`
                }
              </span>)
              : null
            }
          </div>
        )
      } else {
        return (
          <div className="messages__otherUser messages__item" key={item.id}>
            <span className="messages__user">{item.user}</span>
            <span className="messages__text">{item.text}</span>
            {
              time[i].hours ?
              (<span className="messages__time">{`${time[i].hours}:${time[i].minutes}  -  ${time[i].date}/${time[i].month}/${time[i].year}`}</span>)
              : null
            }
          </div>
        )
      }

    })
    // eslint-disable-next-line
  }, [time]);

  return (
    <div className="chat-app">
      <div className="header">
        <h1>Welcome to: {room.toUpperCase()} room</h1>
      </div>
      <div className="messages">
        {showMessages}
      </div>
      <form className="new-message-form" onSubmit={handleSubmit}>
        <input
          className="new-message-input"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" type="submit">Send</button>
      </form>
      <div className="sign-out">
        <button onClick={signUserOut}>Sign Out</button>
      </div>
    </div>
  )
}