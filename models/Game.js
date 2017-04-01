const mongoose = require('mongoose');
const colors = require('./constants/colors')
const util = require('util')
const Schema = mongoose.Schema

const gameModes = require('./constants/game-modes')
const makeMove = require('./helpers/makeMove')
const moveErrors = require('./helpers/moveErrors')
const Pass = require('./helpers/Pass')

/**
 * A model representing logic external to game rules.
 * E.g GameMode does not affect how pieces are captured
 */
const gameMetadataType = {
  whiteUserId: String,
  blackUserId: String,
  gameMode: {
    type: String,
    enum: gameModes.ALL_MODES,
    default: gameModes.HOTSEAT
  },
  winner: {
    type: colors.type, // winner is black, white, or the empty color when tied
    enum: colors.ALL_COLORS
  }
}

/**
 * A model representing a game of go.
 * Contains logic for handling different game modes
 * e.g hotseat, AI-play, multiplayer
 */
const gameSchema = new Schema({
    board: Array,
    turn: {
      type: Number,
      default: colors.BLACK
    },
    turnHistory: { // array of moves or passes
      type: Array,
      default: []
    },
    gameMetadata: gameMetadataType
  })

/**
 * Make a move on this game model.
 * Return the Move or a string message explaining why it cannot be done
 *
 * @param x needs to be an Int because Javascript...
 * @param y needs to be an Int
 * @param color black or white
 * @returns  Move | string
 */
gameSchema.methods.makeMove = function(x, y, color) {
  const errors = moveErrors(x, y, color, this.board, this.turn)
  if (!errors) {
    let move = makeMove(x, y, color, this.board)
    this.turnHistory.push(move)
    this._switchTurnState()

    return move
  } else {
    return errors
  }
}

/**
 * Pass a move on this game model.
 * Return undefined or a string message explaining why it cannot be done
 *
 * @param color
 * @returns {*}
 */
gameSchema.methods.pass = function(color) {
  if (this.turn !== color) {
    return 'You cannot pass when it is not your turn.'
  } else if (this._lastTurnWasPass()) {
    this._endGame()
  } else {
    this.turnHistory.push(Pass(color))
    this._switchTurnState()
    return undefined
  }
}

/**
 * End the game. Assumes last move was already played and will use scores from move history
 */
gameSchema.methods._endGame = function() {
  if (this.turnHistory.length === 0) {
    this.winner = colors.EMPTY
  } else {
    const scores = this.scores()
    let blackScore = scores[0]
    let whiteScore = scores[1]

    if (whiteScore > blackScore) {
      this.winner = colors.WHITE
    } else if (whiteScore < blackScore) {
      this.winner = colors.BLACK
    } else {
      this.winner = colors.EMPTY
    }
  }
}

gameSchema.methods.winnerUsername = function() {
  if (this.isOver()) {
    if (this.winner === colors.BLACK) {
      return 'Black'
    } else if (this.winner === colors.WHITE) {
      return 'White'
    } else {
      return 'Both: ' + 'Black' + ' and ' + 'White'
    }
  } else {
    throw new Error('Cannot get winner username of a game that is not over')
  }
}

gameSchema.methods.isOver = function() {
  return this.winner !== undefined
}

gameSchema.methods._lastTurnWasPass = function() {
  if (this.turnHistory.length === 0) {
    return false;
  } else {
    return this.getLastMove().pass === true
  }
}

gameSchema.methods._switchTurnState = function() {
  if (this.turn === colors.BLACK) {
    this.turn = colors.WHITE
  } else {
    this.turn = colors.BLACK
  }
}

/**
 * Returns the last move of the game. Throws error if there were no moves.
 */
gameSchema.methods.getLastMove = function() {
  if (this.turnHistory.length > 0) {
    return this.turnHistory[this.turnHistory.length - 1]
  } else {
    throw new Error('Cannot get last move of game with no moves!')
  }
}

/**
 * Returns the latest scores of the game in the form [ black, white ]
 */
gameSchema.methods.scores = function() {
  let nonPassMoves = this.turnHistory.filter(move => !move.pass)

  if (nonPassMoves.length === 0) {
    return [0, 0]
  } else {
    let lastNonPassMove = nonPassMoves[nonPassMoves.length - 1]
    return [lastNonPassMove.blackScore, lastNonPassMove.whiteScore]
  }
}

/**
 * Based on this game's current mode, get the logical turn for this user.
 * @returns {*}
 * @private
 */
gameSchema.methods.getUserColor = function(userId) {
  if (this.gameMetadata.gameMode === gameModes.HOTSEAT) {
    return this.turn
  } else if (this.gameMetadata.gameMode === gameModes.ONLINE || this.gameMetadata.gameMode === gameModes.AI) {
    if (this.gameMetadata.whiteUserId === userId) {
      return colors.WHITE
    } else if (this.gameMetadata.blackUserId === userId) {
      return colors.BLACK
    } else {
      throw new Error("Unable to get user color for user: " + userId)
    }
  } else {
    throw new Error("Unable to get color for game mode: " + this.gameMetadata.gameMode)
  }
}

/**
 * Join user to this multiplayer game. Throws error if not a multiplayer game
 * @param userId
 */
gameSchema.methods.joinMultiplayerGame = function(userId) {
  if (this.gameMetadata.gameMode !== gameModes.ONLINE) {
    throw new Error('Tried to join non-multiplayer game')
  }

  if (this.gameMetadata.whiteUserId === undefined) {
    this.gameMetadata.whiteUserId = userId
  } else if (this.gameMetadata.blackUserId === undefined) {
    this.gameMetadata.blackUserId = userId
  } else {
    throw new Error('Cannot join user to multiplayer game since both users are already specified')
  }
}

gameSchema.methods.getAiColor = function(userId) {
  return colors.oppositeOf(this.getUserColor(userId))
}

gameSchema.methods.isUsersTurn = function(userId) {
  return this.getUserColor(userId) === this.turn
}

gameSchema.pre('save', function(next) {
  this.markModified('board') // this is to get mongoose to save nested arrays
  next();
});

module.exports = mongoose.model('Game', gameSchema)

