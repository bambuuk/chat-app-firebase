import { useState, useRef } from 'react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("auth-token"));

  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    localStorage.removeItem('auth-token');
    setIsAuth(false);
    setRoom(null);
  }

  if (!isAuth) {
    return (
      <div className="app">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }

  return (
    <div className='app'>
      {room ? (
          <Chat room={room} />
        ) : (
          <div className="room">
            <label htmlFor="room-name">Enter Room Name:</label>
            <br />
            <br />
            <input id="room-name" type="text" ref={roomInputRef} className='room-name' />
            <button onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
          </div>
        )
      }
      <div className="sign-out">
        <button onClick={signUserOut}>Sign Out</button>
      </div>
    </div>
  )
}

export default App;
