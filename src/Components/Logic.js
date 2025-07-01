// Player Class

class Player {
    constructor(name) {
        this.name = name; // player's name
        this.lives = 3; // 3 lives per person
        this.move = null; // player's current move whether its r,p,s
        this.isAlive = true; // lets us know if the person is in the game or not
    }
    
}