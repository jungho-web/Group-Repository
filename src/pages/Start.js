//`import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import app from '../firebaseConfig';
import { getDatabase, ref, set, get, push } from "firebase/database";

function Start() {
  const [lobbyCode, setLobbyCode] = useState('')

  const joinLobby = async() => {
    const db = getDatabase(app);
    // check if lobby code is empty
    if (lobbyCode === ''){
      console.log("lobby code is empty");
      const newdoc = push(ref(db, "lobbies"));

      set(newdoc, {lobbyid: 'test'})
      .then(() => {console.log("data sent")})
      .catch((error)  => {console.log(error)})
    } 
    // else join the lobby
    else {
      const dbref = ref(db, "lobbies");
      const snapshot = await get(dbref);
      if(snapshot.exists()){
        console.log(Object.keys(snapshot.val()));
      }
      console.log(lobbyCode);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Rock Paper Scissors</h1>
        <div>
          <label>Enter Lobby Code: 
            &nbsp;
            <input type='text' 
            value={lobbyCode}
            onChange={(e)=>setLobbyCode(e.target.value)}
            placeholder='Leave blank for random lobby' 
            className="Lobby-input"/>
          </label>
        </div>
        <div>
        <button onClick={joinLobby}>Join Lobby!</button>
        </div>
      </header>
    </div>
  );
}

export default Start;
