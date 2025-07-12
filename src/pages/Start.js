import logo from './default-dance-fortnite.gif';
import './Start.css';

import { useEffect, useState, useCallback, useRef } from 'react';
import { userData, lobbyData } from './Data'
import app from '../firebaseConfig';
import { getDatabase, ref, get, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { Bracket } from '../Components/bracket';
import '../Components/crowns';
import SpinningCrownsBackground from '../Components/crowns';

// This function determines if move1 beats move2 using standard RPS rules
function beats(move1, move2) {
  return (
    (move1 === "rock" && move2 === "scissors") ||
    (move1 === "scissors" && move2 === "paper") ||
    (move1 === "paper" && move2 === "rock")
  );
}


function Start() {
  const navigate = useNavigate();
  const [state, setState] = useState(0);
  const [playerChoice, setChoice] = useState('');
  const [opponentChoice, setOpponentChoice] = useState('');
  const [opponent, setOpponent] = useState('');
  const [lives, setLives] = useState('');
  const [opponentLives, setOpponentLives] = useState('');
  const [winner, setWinner] = useState('');
  const status = useRef(0);

  const labels = {
    rock: "🗿",
    paper: "📄",
    scissors:"✂️"
  }

  if (lobbyData.id === '') {
    window.location.href = "/";
  }

  const choice = useCallback(async (userChoice) => {
    const db = getDatabase(app);
    const dbref = ref(db, "lobbies/" + lobbyData.id + "/players");
    const snapshot = await get(dbref);
    if (snapshot.exists()) {
      var data = snapshot.val();
      for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] === userData.id || userChoice === "") {
          data[i]['choice'] = userChoice;
        }
      }
      console.log(data);
      setChoice(userChoice);
      if (userChoice !== ""){
        setState(2);
      }
      set(dbref, data).catch((error) => { console.log(error) })
    }

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

  const update = useCallback(async () => {
    const db = getDatabase(app);

    const dbref = ref(db, "lobbies/" + lobbyData.id);
    var snapshot = await get(dbref);
    if (snapshot.exists()) {
      var data = snapshot.val();
      for (var i = 0; i < data.players.length; i++) {
        if (data.players[i].id === opponent) {
          setOpponentChoice(data.players[i].choice);
        if (playerChoice !== "" && opponentChoice !== "") {
          if (beats(playerChoice, opponentChoice) && status.current === 0) {
            data.players[i].lives--;
          }
          if (status.current === 0){
            setState(3);
          }
          refreshLives();

          status.current = 1;
          set(dbref, data)
          .catch((error) => { console.log(error) })
    
        }
          break;
        }
      }

    }
  }, [opponent, opponentChoice, playerChoice])


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
    var snapshot = await get(dbref);
    while (!(snapshot.exists() && snapshot.val().hasOwnProperty("pairs")  && snapshot.val()["pairs"].hasOwnProperty("length"))){
      snapshot = await get(dbref);
    }
    console.log("hi");

    if (snapshot.exists() && snapshot.val().hasOwnProperty("pairs")  && snapshot.val()["pairs"].hasOwnProperty("length")) {
      for (var i = 0; i < snapshot.val()["pairs"].length; i++) {
        for (var j = 0; j < snapshot.val()["pairs"][i].length; j++) {
          if (snapshot.val()["pairs"][i][j][0] === userData.id) {
            if (j === 0 && snapshot.val()["pairs"][i].length > 1) {
              setOpponent(snapshot.val()["pairs"][i][1][0]);
              var lives = "";
              for (var k = 0; k < snapshot.val()["pairs"][i][0][1]; k++) {
                lives += "❤️";
              }
              setLives(lives);
              lives = "";
              for (k = 0; k < snapshot.val()["pairs"][i][1][1]; k++) {
                lives += "❤️";
              }
              setOpponentLives(lives);

            } else if (snapshot.val()["pairs"][i].length === 1) {
              setOpponent("No Opponent");
            }
            else {
              setOpponent(snapshot.val()["pairs"][i][0][0]);
              lives = "";
              for (k = 0; k < snapshot.val()["pairs"][i][1][1]; k++) {
                lives += "❤️";
              }
              setLives(lives);
              lives = "";
              for (k = 0; k < snapshot.val()["pairs"][i][0][1]; k++) {
                lives += "❤️";
              }
              setOpponentLives(lives);
            }
            break;
          }
        }
      }
      setPairs(snapshot.val().pairs);
    } 
  };

  const refreshLives = async () => {

    const db = getDatabase(app);

    const dbref = ref(db, "lobbies/" + lobbyData.id);
    var snapshot = await get(dbref);

    if (snapshot.exists() && snapshot.val().hasOwnProperty("pairs")  && snapshot.val()["pairs"].hasOwnProperty("length")) {
      for (var i = 0; i < snapshot.val()["players"].length; i++) {
        var lives = "";
        if (snapshot.val()["players"][i].id === userData.id){
              for (var k = 0; k < snapshot.val()["players"][i].lives; k++) {
                lives += "❤️";
              }
              setLives(lives);
              
        }
       if (snapshot.val()["players"][i].id === opponent){
              for (var k = 0; k < snapshot.val()["players"][i].lives; k++) {
                lives += "❤️";
              }
              setOpponentLives(lives);
        }
  }}};


  useEffect(() => {
    // Set up the interval
    setTimeout(init, 500);

    // Clean up the interval when the component unmounts
    return () => {}
  }, []); // The empty dependency array ensures this effect runs only once on mount


  useEffect(() => {
    // Set up the interval
    const intervalId = setInterval(update, 250); // Update every 50ms
    //init();

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [update]); // The empty dependency array ensures this effect runs only once on mount


  const handleAnimationEnd = () => {
    setState(1);
  };

  const newRound = () => {
    console.log(opponentLives.length)
    console.log(lives.length)
    if (opponentLives.length === 0 || lives.length === 0){
      if (opponentLives.length === 0){
        setWinner(userData.id);
      }
      if (lives.length === 0){
        setWinner(opponent);
      }
      setState(4);
      return;
    }
    choice("");
    setTimeout(setState(1), 500);
    setTimeout(() => {status.current = 0}, 500);
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
          <div class="grid">
            <div className="Player-1-Side">
              <h1 className="Player-Header">Player 1</h1>
              <h2>{userData.id}</h2>
              <h2>{lives}</h2>
            </div>
            <div className="Player-2-Side">
              <h1 className="Player-Header">Player 2</h1>
              <h2>{opponent}</h2>
              <h2>{opponentLives}</h2>
            </div>
            <div className="Player-1-Side">
              <div className="button-grid">
                <button className="button-17" onClick={() => { choice("rock") }}>🗿</button>
                <button className="button-17" onClick={() => { choice("paper") }}>📄</button>
                <button className="button-17" onClick={() => { choice("scissors") }}>✂️</button>
              </div>
            </div>
            <div className="Player-2-Side">
              <div>
                <h3 className="Opponent-Text">Choosing...</h3>
              </div>
            </div>
          </div>
        </div>
      )
    case 2:
      return (
        <div className="App">
          <div class="grid">
            <div className="Player-1-Side">
              <h1 className="Player-Header">Player 1</h1>
              <h2>{userData.id}</h2>
              <h2>{lives}</h2>
            </div>
            <div className="Player-2-Side">
              <h1 className="Player-Header">Player 2</h1>
              <h2>{opponent}</h2>
              <h2>{opponentLives}</h2>
            </div>
            <div className="Player-1-Side">
              <div>
                <h3 className="Opponent-Text">You chose {labels[playerChoice]}.</h3>
              </div>
            </div>
            <div className="Player-2-Side">
              <div>
                <h3 className="Opponent-Text">Choosing...</h3>
              </div>
            </div>
          </div>
        </div>
      )
    case 3:
      return (
        <div className="App">
          <div class="grid">
            <div className="Player-1-Side">
              <h1 className="Player-Header">Player 1</h1>
              <h2>{userData.id}</h2>
              <h2>{lives}</h2>
            </div>
            <div className="Player-2-Side">
              <h1 className="Player-Header">Player 2</h1>
              <h2>{opponent}</h2>
              <h2>{opponentLives}</h2>
            </div>
            <div className="Player-1-Side">
              <div>
                <h3 className="Opponent-Text">{labels[playerChoice]}</h3>
              </div>
            </div>
            <div className="Player-2-Side">
              <div>
                <h3 className="Opponent-Text">{labels[opponentChoice]}</h3>
              </div>
            </div>
          </div>
          <footer className="white-rectangle-footer" onAnimationEnd={newRound}>
            { }
          </footer>
        </div>
      )
    case 4:
      return (
        <div className='App'>
 <header className="App-header">
        <SpinningCrownsBackground / >
          <img src={logo} className="App-logo" alt="logo" />
            <div style={{ position: "relative", zIndex: 1 }}>
          <h1>WINNER!!!!</h1>
          <h1>{winner}</h1>
          </div>
      </header>
            <footer className="play-timer" onAnimationEnd={()=>navigate('/')}>
            </footer>
        </div>
      )
 
    default:
      return (
        <div className='App'>
            <div style={{ position: "relative", zIndex: 1 }}>
        <header className="App-header">
          <h1>WINNER!!!!</h1>
          <h1>{winner}</h1>
      </header>
      </div>
        </div>
      )

  }
}

export default Start;
