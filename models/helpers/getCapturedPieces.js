const colors = require('../constants/colors')

/**
 * Given a board with pieces on it. Return a list of pieces that are captured that turn.
 * Pure function and does not modify the board
 *
 * @param board
 * @returns Array of {x: x, y: y}
 */
module.exports = function (board) {
  let boardCopy = JSON.parse(JSON.stringify(board)) // this is actually a legit way

  let visited = []
  for (let i = 0; i < boardCopy.length; i++) {
    visited[i] = new Array(boardCopy.length).fill(false)
  }

  let armies = []
  boardCopy.forEach((row, i) => {
    row.forEach((col, j) => {
      if (!visited[i][j] && boardCopy[i][j]) {
        const color = boardCopy[i][j]
        const army = findConnectingArmies(j, i, boardCopy, color, visited)
        armies.push(army)
      }
    })
  })

  let trappedArmies = armies.filter(army => !hasLiberties(army, boardCopy))
  let theCapturedPieces = []
  trappedArmies.forEach(trappedArmy => {
    trappedArmy.forEach(point => {
      theCapturedPieces.push({ x: point.x, y: point.y })
    })
  })

  return theCapturedPieces
}

function findConnectingArmies(x, y, board, color, visited) { // TODO reduce method params by nested function
  visited[y][x] = true
  let army = [ { x: x, y: y } ]

  if (x - 1 >= 0 && !visited[y][x - 1] && board[y][x - 1] === color) { // left
    army = army.concat(findConnectingArmies(x - 1, y, board, color, visited))
  }
  if (x + 1 < board.length && !visited[y][x + 1] && board[y][x + 1] === color) { // right
    army = army.concat(findConnectingArmies(x + 1, y, board, color, visited))
  }
  if (y - 1 >= 0 && !visited[y - 1][x] && board[y - 1][x] === color) { // down
    army = army.concat(findConnectingArmies(x, y - 1, board, color, visited))
  }
  if (y + 1 < board.length && !visited[y + 1][x] && board[y + 1][x] === color) { // up
    army = army.concat(findConnectingArmies(x, y + 1, board, color, visited))
  }

  return army
}

function hasLiberties(army, board) {
  return army.some(point => {
    let x = point.x
    let y = point.y

    let leftLiberty = x - 1 >= 0 && board[y][x - 1] === colors.EMPTY
    let rightLiberty = x + 1 < board.length && board[y][x + 1] === colors.EMPTY
    let topLiberty = y + 1 < board.length && board[y + 1][x] === colors.EMPTY
    let bottomLiberty = y - 1 >= 0 && board[y - 1][x] === colors.EMPTY

    return leftLiberty || rightLiberty || topLiberty || bottomLiberty
  })
}