const implementation = require('./ai-implementation/index')

exports.makeMove = function (board, lastMove, callback) {
  implementation
    .makeMove(createPayload(board, lastMove), (err, aiMove) => {
      if (err) {
        callback(err)
      } else {
        callback(null, fromAIFormat(aiMove))
      }
    })
}

function createPayload(board, lastMove) {
  return {
    board: board,
    last: toAIFormat(lastMove),
    size: board.length
  }
}

function toAIFormat(move) {
  if (move.pass) {
    return {
      pass: true,
      c: move.color,
      x: 0, y: 0
    }
  } else {
    return {
      x: move.y, // swap needed for api
      y: move.x,
      pass: false,
      c: move.color
    }
  }
}

function fromAIFormat(move) {
  return { // swap return from api
    x: move.y,
    y: move.x,
    pass: move.pass
  }
}
