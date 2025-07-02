import './Lobby.css';
import { lobbyData, userData } from './Data'
import { useEffect, useState, useCallback } from 'react';
import app from '../firebaseConfig';
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';

function Lobby() {
    const navigate = useNavigate();

    if (lobbyData.id === '') {
        window.location.href = "/";
    }
    const [players, setPlayers] = useState('');

    const update = useCallback(async () => {
        const db = getDatabase(app);

        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            setPlayers(snapshot.val().toString());
        }
    }, [])


    const leave = useCallback(async () => {
        const db = getDatabase(app);

        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            var data = snapshot.val();
            var index = data.indexOf(userData.id);
            if (index > -1) {
                data.splice(index, 1);
            }
            if (data.length === 0) {
                const lobbyRef = ref(db, "lobbies/" + lobbyData.id);
                await remove(lobbyRef);
                navigate("/join");
            } else {
                set(dbref, data)
                .then(() => { navigate("/join") })
                .catch((error) => { console.log(error) })
            }
        }
    }, [navigate])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Prompt the user for confirmation if needed
            // For example, if there are unsaved changes
            event.preventDefault(); 
            leave();
            event.returnValue = ''; // For older browsers, also set returnValue
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [leave]); // Empty dependency array ensures this runs once on mount and cleans up on unmount


    useEffect(() => {
        // Set up the interval
        const intervalId = setInterval(update, 50); // 5000 milliseconds = 5 seconds

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [update]); // The empty dependency array ensures this effect runs only once on mount

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
                <button onClick={leave}>Leave</button>
                <h2> Code: {lobbyData.id}</h2>
            </header>
        </div>
    );
}

export default Lobby;
