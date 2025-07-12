import './App.css';
import {Link} from "react-router-dom";
import "../Components/crowns"

import {userData} from "./Data";
import SpinningCrownsBackground from "../Components/crowns";

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
          <button className="btn btn-join"> Join </button>
        </Link>
        <button className="btn btn-settings" onClick={changeName}> Settings </button>
      </header>
    </div>
  );
}

export default App;
