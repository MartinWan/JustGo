const Move = require('./move')

class MoveBuilder {
  constructor(x, y, color) { // TODO add scores here they're mandatory right?
    this.x = x
    this.y = y
    this.color = color

    // init optional params
    this.pass = false
    this.getCapturedPieces = []
    this.blackScore = 0
    this.whiteScore = 0
    this.whiteTime = 0
    this.blackTime = 0
  }

  setPass(pass) {
    this.pass = pass
    return this
  }

  setScores(blackScore, whiteScore) {
    this.blackScore = blackScore
    this.whiteScore = whiteScore
  }

  setCapturedPieces(capturedPieces) {
    this.capturedPieces = capturedPieces
    return this
  }
  // TODO score setters
  build() {
    return new Move({
      x: this.x,
      y: this.y,
      color: this.color,
      pass: this.pass,
      capturedPieces: this.capturedPieces,
      whiteScore: this.whiteScore,
      blackScore: this.blackScore,
      whiteTime: this.whiteTime,
      blackTime: this.blackTime
    })
  }
}

module.exports = MoveBuilder