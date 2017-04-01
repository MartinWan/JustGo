const colors = require('../constants/colors')
const getCapturedPieces = require('./getCapturedPieces')

/**
 * Returns the potential reason the move is illegal (string)
 * If the move is legal, nothing is returned.
 *
 * Pure function so nothing is modified
 * @param x
 * @param y
 * @param color
 * @param boardReference the real board of the game that we must copy
 * @returns {undefined | string}
 */
module.exports = function(x, y, color, boardReference, turn, moveHistory) {
  if (turn !== color) {
    return NOT_YOUR_TURN
  }

  const board = JSON.parse(JSON.stringify(boardReference))
  if (board[y][x] !== colors.EMPTY) {
    return OCCUPIED_POSITION
  } else {
    board[y][x] = color
    const capturedPieces = getCapturedPieces(board)
    if (capturedPieces.some(capturedPiece => capturedPiece.x == x && capturedPiece.y == y)) {
      return SUICIDE
    }
  }

  // ko rule

  return undefined
}

const NOT_YOUR_TURN = 'It is not your turn.'
const OCCUPIED_POSITION = 'You cannot move into an occupied position.'
const SUICIDE = 'You cannot commit suicide.'