const readlineSync = require("readline-sync");
const { Player, makeRound, beats, runTournament } = require("./Logic.js");

// Create two players
const player1 = new Player("Ron");
const player2 = new Player("Julian");

// Loop until someone dies
while (player1.isAlive && player2.isAlive) {
  // Get user input for each player
  const move1 = readlineSync.question(
    `${player1.name}, choose your move (rock/paper/scissors): `
  );
  const move2 = readlineSync.question(
    `${player2.name}, choose your move (rock/paper/scissors): `
  );

  console.log("move1", move1);
  console.log("move2", move2);

  // Store their move
  player1.move = move1.toLowerCase();
  player2.move = move2.toLowerCase();

  // Print moves
  // console.log(`${player1.name} chose ${player1.move}`);
  // console.log(`${player2.name} chose ${player2.move}`);

  // Determine result
  if (beats(player1.move, player2.move)) {
    console.log(`${player1.name} wins this round!`);
    player2.loseLife();
  } else if (beats(player2.move, player1.move)) {
    console.log(`${player2.name} wins this round!`);
    player1.loseLife();
  } else {
    console.log(`It's a tie!`);
  }

  // Show lives
  console.log(`${player1.name} has ${player1.lives} lives left.`);
  console.log(`${player2.name} has ${player2.lives} lives left.\n`);
}

// Announce winner
const winner = player1.isAlive ? player1 : player2;
console.log(`\n🏆 ${winner.name} wins the match!`);
