import './App.css';
import {Link} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Rock Paper Scissors! </h1>
        <Link to = {"/join"}>
          <button> Join </button>
        </Link>
        <button> Settings </button>
      </header>
    </div>
  );
}

export default App;
