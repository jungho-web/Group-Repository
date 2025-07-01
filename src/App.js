//`import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import app from './firebaseConfig';
import { getDatabase, ref, set, get, push } from "firebase/database";

function App() {

  const [lobbyCode, setLobbyCode] = useState('')

  const joinLobby = async() => {
    const db = getDatabase(app);
    // Check if lobby code is empty
    if (lobbyCode === ''){
      console.log("Lobby Code is empty");
      const newDoc = push(ref(db, "lobbies"));

      set(newDoc, {lobbyID: uniqueId})
      .then(() => {console.log("Data Sent")})
      .catch((error)  => {console.log(error)})
    } 
    // Else join the lobby
    else {
      const dbRef = ref(db, "lobbies");
      const snapshot = await get(dbRef);
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

export default App;
