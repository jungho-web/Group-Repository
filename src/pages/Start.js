//`import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

import app from './firebaseConfig';
import { getDatabase, ref, set, get, push } from "firebase/database";

function Start() {
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
