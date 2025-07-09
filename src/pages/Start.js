//`import logo from './logo.svg';
import './App.css';

import { useEffect, useState, useCallback, useRef} from 'react';
import { userData, lobbyData } from './Data'
import app from '../firebaseConfig';
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { Bracket } from '../components/bracket';

function Start() {
  const navigate = useNavigate();

  if (lobbyData.id === '') {
    window.location.href = "/";
  }

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

    const dbref = ref(db, "lobbies/" + lobbyData.id );
    const snapshot = await get(dbref);
    
    if(snapshot.exists()){
      setPairs(snapshot.val().pairs);
    }
  };

  useEffect(() => {
    // Set up the interval
    init();

    return () => {};
  }, []); // The empty dependency array ensures this effect runs only once on mount



  return (
    <div className="App">
      <header className="App-header">
        <h1>Matches</h1>
        <div>
          <Bracket>{pairsData}</Bracket>
        </div>
      </header>
    </div>
  );
}

export default Start;
