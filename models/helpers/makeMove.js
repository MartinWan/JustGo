const MoveBuilder = require('./moveBuilder')
const colors = require('../constants/colors')
const calculateScores = require('./calculateScores')
const getCapturedPieces = require('./getCapturedPieces')

/**
 * Make a move x, y for a color on a board. Assumes it is already validated & legal.
 * Pieces that are captured are removed from the board.
 *
 * @param x - Row Number
 * @param y - Column Number
 * @param color
 * @param board - Nested array representing the board
 * @returns {Move} An containing captured pieces and other move data
 */
module.exports = function(x, y, color, board) {
  const builder = new MoveBuilder(x, y, color)
  board[y][x] = color

  const capturedPieces = getCapturedPieces(board)
  capturedPieces.forEach(capturedPiece => {
    board[capturedPiece.y][capturedPiece.x] = colors.EMPTY
  })
  builder.setCapturedPieces(capturedPieces)

  const scores = calculateScores(board)
  builder.setScores(scores[0], scores[1])

  return builder.build()
}

