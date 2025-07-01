import logo from './logo.svg';
import './App.css';

function Lobby() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Lobby </h1>
        <div style={{width: "600px",
            height: "400px",
            border: "2px solid white",
            padding: "10px",
            margin: "10px"}}>
            <p> Player 1</p>
            <p> Player 2</p>
        </div>
        <h2> Code: </h2>
      </header>
    </div>
  );
}

export default Lobby;
