// This class will define a Player object, which holds all the data needed for each player
class Player {
  constructor(name) {
    this.name = name; // player's name
    this.lives = 3; // 3 lives per person
    this.isAlive = true; // lets us know if the person is still in the game
  }

  // This function resets a player’s lives and status after winning a match
  reset() {
    this.lives = 3; // restores lives to full
    this.isAlive = true; // sets player back to alive in case they had lost lives before
  }

  // This function subtracts one life from the player (if they lose a round)
  loseLife() {
    this.lives -= 1; // subtracts 1 from the player’s total lives
    if (this.lives == 0) {
      // if the player has 0 lives left
      this.isAlive = false; // then they are eliminated (dead)
    }
  }
}

// This function determines if move1 beats move2 using standard RPS rules
function beats(move1, move2) {
  return (
    (move1 === "rock" && move2 === "scissors") ||
    (move1 === "scissors" && move2 === "paper") ||
    (move1 === "paper" && move2 === "rock")
  );
}

// This function handles one full 1v1 match until a player loses all 3 lives
function play1v1Battle(player1, player2, moves1, moves2) {
  let output = `\n Match: ${player1.name} vs ${player2.name} \n`; // start of match printout
  let p1Index = 0; // move index for player1
  let p2Index = 0; // move index for player2

  // keep playing until one player has no lives left
  while (player1.isAlive && player2.isAlive) {
    const move1 = moves1[p1Index % moves1.length]; // pick move from player1's move list
    const move2 = moves2[p2Index % moves2.length]; // pick amove from player2's move list

    output += `${player1.name} uses ${move1} | ${player2.name} uses ${move2}\n`; // print their moves

    if (beats(move1, move2)) {
      player2.loseLife(); // player2 loses a life if player1 beats them
      output += `${player1.name} wins the round! ${player2.name} has ${player2.lives} lives left.\n`;
    } else if (beats(move2, move1)) {
      player1.loseLife(); // player1 loses a life if player2 beats them
      output += `${player2.name} wins the round! ${player1.name} has ${player1.lives} lives left.\n`;
    } else {
      output += `It's a tie. No lives lost.\n`; // if it's a draw, no one loses lives
    }

    p1Index++; // go to the next move for player1
    p2Index++; // go to the next move for player2
  }

  const winner = player1.isAlive ? player1 : player2; // the one still alive is the winner
  output += ` ${winner.name} wins the match and moves to the next round!\n`; // print winner of match
  winner.reset(); // reset winner’s lives to 3 for the next round
  return [winner, output]; // return the winner and the output string
}

// This function removes players who have been eliminated (not used in tournament logic here, but exported for manual rounds)
function makeRound(players) {
  return players.filter((player) => player.isAlive); // returns only players who are still alive
}

// This function handles the entire tournament and runs all 1v1 matches
function runTournament(players, allMoves) {
  let output = ""; // this stores all text output of the tournament
  let roundNumber = 1; // tracks what round we are in

  if (players.length % 2 !== 0) {
    throw new Error(
      "Tournament requires an even number of players (no byes allowed)."
    );
  }

  // continue running rounds until only 1 player is left
  while (players.length > 1) {
    output += `\n=== ROUND ${roundNumber} ===\n`; // print round number
    const nextRound = []; // list of winners who go to next round

    for (let i = 0; i < players.length; i += 2) {
      // loop through players in pairs
      const player1 = players[i]; // first player in the pair
      const player2 = players[i + 1]; // second player in the pair

      const moves1 = allMoves[player1.name]; // grab player1’s move list
      const moves2 = allMoves[player2.name]; // grab player2’s move list

      const [winner, matchOutput] = play1v1Battle(
        player1,
        player2,
        moves1,
        moves2
      ); // play match
      output += matchOutput; // add match result to output log
      nextRound.push(winner); // move winner into next round
    }

    players = nextRound; // update players list with winners only
    roundNumber++; // increment round
  }

  output += `\n TOURNAMENT WINNER: ${players[0].name} \n`; // final winner announcement
  return output; // return all printed output
}

// ========== TEST / SIMULATION ==========

// These are the players for the tournament
const players = [
  new Player("Ron"),
  new Player("Julian"),
  new Player("Joel"),
  new Player("Guest"),
];

// These are the move sequences each player will use during their matches
const allMoves = {
  Ron: ["rock", "paper", "scissors", "rock", "rock"], // example sequence of moves for Ron
  Julian: ["scissors", "rock", "rock", "paper", "rock"], // example for Julian
  Joel: ["rock", "scissors", "rock", "paper", "scissors"], // for Joel
  Guest: ["paper", "paper", "rock", "scissors", "scissors"], // and Guest
};

// Run the tournament and display all results in the console
// console.log(runTournament(players, allMoves));

// Export all needed functions for use in other files
module.exports = {
  Player,
  makeRound,
  beats,
  runTournament,
};
