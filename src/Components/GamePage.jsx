import React from 'react';
import PlayerCard from './PlayerCard';

// 🔁 This function checks which move wins
function beats(move1, move2) {
    return (
      (move1 === 'rock' && move2 === 'scissors') ||
      (move1 === 'scissors' && move2 === 'paper') ||
      (move1 === 'paper' && move2 === 'rock')
    );
  }
  
  export default function GamePage() {
    // 🎮 List of all players to start the tournament
    const [players, setPlayers] = useState([
      { name: 'Ron', lives: 3 },
      { name: 'Julian', lives: 3 },
      { name: 'Joel', lives: 3 },
      { name: 'Alice', lives: 3 }
    ]);
  
    // 🔁 Track the current two battling players (by index)
    const [currentPair, setCurrentPair] = useState([0, 1]);
  
    // 🧠 Save the moves each player picks
    const [moves, setMoves] = useState({});
  
    // 📜 Game text output
    const [output, setOutput] = useState('');
  
    // 🎉 Track when tournament is over
    const [tournamentOver, setTournamentOver] = useState(false);
  
    // 📥 When a player picks a move
    const handleMove = (playerName, move) => {
      const newMoves = { ...moves, [playerName]: move };
      setMoves(newMoves);
  
      if (Object.keys(newMoves).length === 2) {
        processRound(newMoves);
      }
    };
  
    // 🧠 Run logic when both players have picked
    const processRound = (moves) => {
      const [i1, i2] = currentPair;
      const player1 = players[i1];
      const player2 = players[i2];
  
      const move1 = moves[player1.name];
      const move2 = moves[player2.name];
  
      let result = `\n${player1.name} chose ${move1} | ${player2.name} chose ${move2}\n`;
  
      // ⚔️ Determine winner
      let updatedPlayers = [...players];
  
      if (beats(move1, move2)) {
        updatedPlayers[i2].lives -= 1;
        result += `${player1.name} wins the round! ${player2.name} has ${updatedPlayers[i2].lives} lives left.\n`;
      } else if (beats(move2, move1)) {
        updatedPlayers[i1].lives -= 1;
        result += `${player2.name} wins the round! ${player1.name} has ${updatedPlayers[i1].lives} lives left.\n`;
      } else {
        result += "It's a tie. No lives lost.\n";
      }
  
      // ❌ If someone died, remove them and reset the winner
      if (updatedPlayers[i1].lives === 0 || updatedPlayers[i2].lives === 0) {
        const winner = updatedPlayers[i1].lives > 0 ? updatedPlayers[i1] : updatedPlayers[i2];
        result += `🏆 ${winner.name} wins the match and moves on!\n`;
  
        // Reset winner’s lives
        winner.lives = 3;
  
        // Remove the loser
        const nextPlayers = updatedPlayers.filter(p => p.lives > 0);
  
        // 🔚 Check if tournament is over
        if (nextPlayers.length === 1) {
          setTournamentOver(true);
          result += `\n🎉 ${nextPlayers[0].name} wins the TOURNAMENT!\n`;
          setOutput(prev => prev + result);
          return;
        }
  
        setPlayers(nextPlayers);
        setCurrentPair([0, 1]); // Move to next pair
        setMoves({});
        setOutput(prev => prev + result);
      } else {
        // If no one is eliminated, update state and continue
        setPlayers(updatedPlayers);
        setMoves({});
        setOutput(prev => prev + result);
      }
    };
  
    // 🏁 If tournament is over, show result
    if (tournamentOver) {
      return (
        <div>
          <h1>🏁 Tournament Complete</h1>
          <pre>{output}</pre>
        </div>
      );
    }
  
    const [i1, i2] = currentPair;
    const player1 = players[i1];
    const player2 = players[i2];
  
    return (
      <div>
        <h1>⚔️ Rock Paper Scissors Tournament</h1>
        <div style={{ display: 'flex', gap: '3rem' }}>
          <PlayerCard player={player1} onSelectMove={(move) => handleMove(player1.name, move)} />
          <PlayerCard player={player2} onSelectMove={(move) => handleMove(player2.name, move)} />
        </div>
        <pre>{output}</pre>
      </div>
    );
  }
