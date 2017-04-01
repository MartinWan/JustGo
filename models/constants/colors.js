const EMPTY = 0
const BLACK = 1
const WHITE = 2

exports.type = Number

exports.BLACK = BLACK
exports.WHITE = WHITE
exports.EMPTY = EMPTY

exports.ALL_COLORS = [BLACK, WHITE, EMPTY]

exports.isValidColor = function (color) {
  return color === BLACK || color === WHITE
}

exports.oppositeOf = function (color) {
  if (color === BLACK) {
    return WHITE
  } else if (color === WHITE) {
    return BLACK
  } else {
    throw 'Cannot get the opposite color of: ' + color
  }
}