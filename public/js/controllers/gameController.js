/**
 * Handles logic for manipulating gmae container view state
 */
class GameController {
  constructor(gameContainerView, server) {
    gameContainerView.render()
    this._boardView = gameContainerView.boardView
    this._scoreView = gameContainerView.scoreView
    this._passButtonView = gameContainerView.passButtonView
    this._server = server

    this._server.pullUpdates((err, update) => {
      if (update.gameOver === true) {
        this._handleGameOver(update)
      } else {
        this._updateGameView(update)
      }
    })

    this._boardView.subscribeClick((x, y) => {
      this._server.makeMove(x, y, (err, move) => {
        if (err) throw err
        if (!move.invalid) {
          this._updateGameView(move)
        } else {
          window.alert(move.invalid)
        }
      })
    })

    this._passButtonView.passClicked = () => {
      this._server.pass((err, move) => {
        if (move.invalid) {
          window.alert(move.invalid)
        }
      })
    }
  }

  _handleGameOver(update) {
    this._boardView.unsubscribeMouse()
    this._passButtonView.destroy()

    window.alert('The Game is Over! The winner is: ' + update.winnerUsername)
    this._boardView.clearBoard()

    let turnHistory = update.turnHistory
    let i = 0
    let loop = setInterval(() => {
      if (i < turnHistory.length) {
        let move = turnHistory[i]
        if (!move.pass) this._updateGameView(move)
        i++
      } else {
        clearInterval(loop)
      }
    }, 300)
  }

  _updateGameView(move) {
    if (move.pass !== true) {
      this._boardView.drawPiece(move.x, move.y, move.color)
      this._boardView.animateRemove(move.capturedPieces)
      this._scoreView.updateScores(move.blackScore, move.whiteScore)
    } else {
      window.alert('The other player has passed')
    }
  }
}

class GameControllerFactory {
  constructor(gameContainerViewFactory, server) {
    this._gameContainerViewFactory = gameContainerViewFactory
    this._server = server
  }

  createController(boardSize) {
    new GameController(
      this._gameContainerViewFactory.createBoardContainerView(boardSize),
      this._server
    )
  }
}
