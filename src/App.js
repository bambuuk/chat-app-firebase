import { useState, useRef } from 'react';
import { Auth } from './components/Auth';
import { Chat } from './components/Chat';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import './styles/app.scss';

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
          <Chat room={room} signUserOut={signUserOut} setRoom={setRoom} />
        ) : (
          <div className="room">
            <label htmlFor="room__name">Enter Room Name:</label>
            <br />
            <br />
            <input id="room-name" type="text" ref={roomInputRef} className='room-name' />
            <button className="controlBtn" onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
            <button className="controlBtn" onClick={signUserOut}>Sign Out</button>
          </div>
        )
      }
    </div>
  )
}

export default App;
