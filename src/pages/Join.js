import './Join.css';
import { useState } from 'react';

import { userData, lobbyData } from './Data'
import { useNavigate } from 'react-router-dom';

import app from '../firebaseConfig';
import { getDatabase, ref, set, get, push } from "firebase/database";

function Join() {
    const [lobbyCode, setLobbyCode] = useState('')
    const navigate = useNavigate();

    const back = () => {
        navigate("/");
    }
    const joinLobby = async () => {
        const db = getDatabase(app);
        // check if lobby code is empty
        if (lobbyCode === '') {
            console.log("lobby code is empty");
            const reference = ref(db, "lobbies")
            const newdoc = push(reference);

            lobbyData.id = newdoc.key;
            lobbyData.players = [{id: userData.id, ready: false, host: true}];
            set(newdoc, lobbyData)
                .then(() => { navigate("/lobby") })
                .catch((error) => { console.log(error) })
        }
        // else join the lobby
        else {
            // Get database refrendce
            const dbref = ref(db, "lobbies");
            const snapshot = await get(dbref);

            if (snapshot.exists()) {
                var data = snapshot.val();
                var validIDs = Object.keys(data);
                // Check if lobby is valid
                if (validIDs.includes(lobbyCode)) {
                    // If it exists join lobby
                    data[lobbyCode]["players"].push({id: userData.id, ready: false, host: false});

                    const reference = ref(db, "lobbies/" + lobbyCode);

                    lobbyData.id = lobbyCode;
                    set(reference, data[lobbyCode])
                        .then(() => { navigate("/lobby") })
                        .catch((error) => { console.log(error) })
                }
                else {
                    console.log("Lobby Does Not Exist");
                }
            }
            console.log(lobbyCode);
        }
    }


    return (
        <div className="App">
            <header className="App-header">
                <h1>Join a Lobby!</h1>
                <p> Input Lobby Code:
                    &nbsp;
                    <input type='text'
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value)}
                        placeholder='Leave blank for random lobby'
                        className="Lobby-input" />
                </p>

                <button className="btn" onClick={joinLobby}>Join</button>
                <button className="btn" onClick={back}>Back</button>
            </header>
        </div>
    );
}

export default Join;
