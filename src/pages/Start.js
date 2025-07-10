//`import logo from './logo.svg';
import './Start.css';

import { useEffect, useState, useCallback, useRef } from 'react';
import { userData, lobbyData } from './Data'
import app from '../firebaseConfig';
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { Bracket } from '../components/bracket';


function Start() {
  const navigate = useNavigate();
    const [state, setState] = useState(0); 

  if (lobbyData.id === '') {
    window.location.href = "/";
  }

  const choice = useCallback(async (choice) => {
    const db = getDatabase(app);
    const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
    const snapshot = await get(dbref);
    if (snapshot.exists()) {
      var data = snapshot.val();
      for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] === userData.id) {
          data[i]['choice'] = choice;
          break;
        }
      }
    }
    set(dbref, data).catch((error) => { console.log(error) })
 
  }, [])
  // Remove from db when leaving
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
        if (index === 0) {
          data[0]['host'] = true;
        }
        set(dbref, data)
          .then(() => { navigate("/join") })
          .catch((error) => { console.log(error) })
      }
    }
  }, [navigate])

  // Leave when user closes the page
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


  // On initialize
  var [pairsData, setPairs] = useState();

  const init = async () => {
    const db = getDatabase(app);

    const dbref = ref(db, "lobbies/" + lobbyData.id);
    const snapshot = await get(dbref);

    if (snapshot.exists()) {
      setPairs(snapshot.val().pairs);
    }
  };

  useEffect(() => {
    // Set up the interval
    init();

    return () => { };
  }, []); // The empty dependency array ensures this effect runs only once on mount


  const handleAnimationEnd = () => {
    setState(1);
    console.log(state);

    // Run your desired script here
  };

  switch (state) {
    case 0:
      return (
        <div className="App">
          <header className="App-header">
            <h1>Matches</h1>
            <div>
              <Bracket>{pairsData}</Bracket>
            </div>
          </header>
          <footer className="white-rectangle-footer" onAnimationEnd={handleAnimationEnd}>
            { }
          </footer>
        </div>
      );
      case 1:
        return (
          <div className="App">
            <div class = "grid">
              <div className = "Player-1-Side">
                <h1 className="Player-Header">Player 1</h1>
              </div>
                            <div className = "Player-2-Side">
                <h1 className="Player-Header">Player 2</h1>
              </div>
              <div className = "Player-1-Side">
              <div className = "button-grid">
                  <button className="button-17" onClick={() => {choice("rock")}}>🗿</button>
                  <button className="button-17" onClick={() => {choice("paper")}}>📄</button>
                  <button className="button-17" onClick={() => {choice("scissors")}}>✂️</button>
              </div>
              </div>
              <div className = "Player-2-Side">
              <div>
                <h3 className="Opponent-Text">Choosing...</h3>
              </div>
              </div>
              <footer className="play-timer" onAnimationEnd={handleAnimationEnd}>
              </footer>
            </div>
          </div>
        )
      default:
        return(
          <div className ='App'>

          </div>
        )

  }
}

export default Start;
