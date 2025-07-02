import './Lobby.css';
import { lobbyData } from './Data'
import { useEffect, useState } from 'react';
import app from '../firebaseConfig';
import { getDatabase, ref, get } from "firebase/database";

function Lobby() {
    if (lobbyData.id === '') {
        window.location.href = "/";
    }
      const [players, setPlayers] = useState('');

    const update = async () => {
        const db = getDatabase(app);

        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            setPlayers(snapshot.val().toString());
        }
    }

    useEffect(() => {
        // Set up the interval
        const intervalId = setInterval(update, 500); // 5000 milliseconds = 5 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // The empty dependency array ensures this effect runs only once on mount

    return (
        <div className="App">
            <header className="App-header">
                <h1> Lobby </h1>
                <div style={{
                    width: "600px",
                    height: "400px",
                    border: "2px solid white",
                    padding: "10px",
                    margin: "10px"
                }}>
                <p>{players}
                </p>
                </div>
                <h2> Code: {lobbyData.id}</h2>
            </header>
        </div>
    );
}

export default Lobby;
