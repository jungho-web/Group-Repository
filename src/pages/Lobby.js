import './Lobby.css';
import { lobbyData, userData } from './Data'
import { useEffect, useState, useCallback } from 'react';
import app from '../firebaseConfig';
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array
}

function Lobby() {
    const navigate = useNavigate();

    if (lobbyData.id === '') {
        window.location.href = "/";
    }

    const [players, setPlayers] = useState('');

    const ready = useCallback(async () => {
        const db = getDatabase(app);

        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()){
            var data = snapshot.val();
            console.log(data);
            for (var i = 0; i < data.length;i++){
                if (data[i]['id'] === userData.id){
                    data[i]['ready'] = !data[i]['ready'];
                }
            }
            set(dbref, data)
                    .catch((error) => { console.log(error) })
         
        }
    }, [])

    const update = useCallback(async () => {
        const db = getDatabase(app);

        const dbref = ref(db, "lobbies/" + lobbyData.id);
        var snapshot = await get(dbref);
        if (snapshot.exists()) {
            var host = false;
            var string = "";
            for (var i = 0; i < snapshot.val()["players"].length; i++) {
                if (snapshot.val()["players"][i]['host'] === true){
                    if (userData.id === snapshot.val()["players"][i]['id']){
                        host = true;
                    }
                    string = string + snapshot.val()["players"][i]['id'] + "👑 : " + snapshot.val()["players"][i]['ready'] + "\n";
                } else {
                    string = string + snapshot.val()["players"][i]['id'] + ": " + snapshot.val()["players"][i]['ready'] + "\n";
                }
            }
            setPlayers(string);
            if (snapshot.val()['start'] === true && host){
                var data = snapshot.val();
                const players = data['players']
                var shuffled = shuffle(players);
                var pairs = [];
                for (i = 0; i < shuffled.length; i+=2){
                    var pair = [];
                    pair.push([shuffled[i].id, shuffled[i].lives]);
                    if (i + 1 === shuffled.length){
                        pairs.push(pair);
                        break;
                    }
                    pair.push([shuffled[i + 1].id, shuffled[i].lives]);
                    pairs.push(pair);
                }
                data['pairs'] = pairs;

                const dbref2 = ref(db, "lobbies/" + lobbyData.id + "/pairs");
                set(dbref2, data['pairs'])
                    .catch((error) => { console.log(error) })

                navigate('/start');
            } else if (snapshot.val()['start'] === true){
                navigate('/start');


            }
        }
    }, [navigate])


    const leave = useCallback(async () => {
        const db = getDatabase(app);
        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()) {
            var data = snapshot.val();
            var index = -1;
            for (var i = 0; i < data.length; i++) {
                if (data[i]['id'] === userData.id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                data.splice(index, 1);
            }

            if (data.length === 0) {
                const lobbyRef = ref(db, "lobbies/" + lobbyData.id);
                await remove(lobbyRef);
                navigate("/join");
            } else {
                if (index === 0){
                    data[0]['host'] = true;
                }
                set(dbref, data)
                    .then(() => { navigate("/join") })
                    .catch((error) => { console.log(error) })
            }
        }
    }, [navigate])

    const start = useCallback(async () => {
        const db = getDatabase(app);
        const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
        const snapshot = await get(dbref);
        if (snapshot.exists()){
            var data = snapshot.val();
            var ready = true;
            // Check if everyone is ready
            for (var i = 0; i < data.length; i++){
                if (data[i]['ready'] === false){
                    ready = false;
                    break;
                }
            }
            // If everyone is ready, then start the game
            if (ready){
                const dbref = ref(db, "lobbies/" + lobbyData.id);
                const snapshot = await get(dbref);
                if (snapshot.exists()){
                    data = snapshot.val();
                    data["start"] = true;
                    set(dbref, data)
                    .catch((error) => { console.log(error) })
                }
            }
        }

    }, []);

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

    window.onpopstate = () => {
        leave();
    }

    useEffect(() => {
        // Set up the interval
        const intervalId = setInterval(update, 100); // Update every 50ms

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
                    <label style={{ whiteSpace: "pre-line" }}>{players}
                    </label>
                </div>
                <div>
                    <button onClick={start} className="btn btn-start">Start</button>
                    &nbsp;
                    <button onClick={ready} className="btn btn-ready">Ready!</button>
                    &nbsp;
                    <button onClick={leave} className="btn btn-leave">Leave</button>
                </div>
                <h2> Code: {lobbyData.id}</h2>
            </header>
        </div>
    );
}

export default Lobby;
