import './App.css';
import {Link} from "react-router-dom";

import {userData} from "./Data";

function App() {
  var changeName = () => {
    var thing = prompt("Enter Name");
    userData.id = thing;
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1> Rock Paper Scissors! </h1>
        <Link to = {"/join"}>
          <button className='btn'> Join </button>
        </Link>
        <button className='btn' onClick={changeName} > Change Name </button>
      </header>
    </div>
  );
}

export default App;
