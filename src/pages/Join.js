import logo from './logo.svg';
import './App.css';

function Join() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Join a Lobby!</h1>
        <p> Input Lobby Code: 
            &nbsp;
            <input type='text' placeholder='Leave Empty For New Lobby' style={{width: '250px', height: '25px'}}></input>
        </p>
        <button>Join</button>
      </header>
    </div>
  );
}

export default Join;
