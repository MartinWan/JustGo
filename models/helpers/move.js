/**
 * Class representing a legal move in the game
 * along with all information associated with it
 */
class Move {
  constructor(options, actions) {
    this.x = options.x;
    this.y = options.y;
    this.color = options.color;
    this.pass = options.pass;
    this.capturedPieces = options.capturedPieces;
    this.whiteScore = options.whiteScore;
    this.blackScore = options.blackScore;
    this.whiteTime = options.whiteTime;
    this.blackTime = options.blackTime;
    this.actions = actions
  }
}

module.exports = Move