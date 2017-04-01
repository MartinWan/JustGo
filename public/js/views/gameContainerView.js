/**
 * A simple container that contains the view of the game.
 * Includes board, scores, game log etc.
 */
class GameContainerView {
  constructor(parent, boardView, scoreView, passButtonView) {
    this._parent = parent
    this._boardView = boardView
    this._scoreView = scoreView
    this._passButtonView = passButtonView
  }

  render() {
    const gameContainer = document.createElement('div')
    gameContainer.setAttribute('id', 'gameContainer')

    const boardContainer = document.createElement('div')
    boardContainer.setAttribute('id', 'boardContainer')
    boardContainer.appendChild(this._boardView.parent)
    this._boardView.render()

    const scoreContainer  = document.createElement('div')
    scoreContainer.setAttribute('id', 'scoreContainer')
    scoreContainer.appendChild(this._scoreView.parent)
    this._scoreView.render()

    const passButtonContainer = document.createElement('div')
    passButtonContainer.setAttribute('id', 'passButtonContainer')
    passButtonContainer.appendChild(this._passButtonView.parent)
    this._passButtonView.render()

    gameContainer.appendChild(scoreContainer)
    gameContainer.appendChild(passButtonContainer)
    gameContainer.appendChild(boardContainer)

    this._parent.appendChild(gameContainer)
  }
  
  get passButtonView() {
    return this._passButtonView
  }

  get boardView() {
    return this._boardView
  }

  get scoreView() {
    return this._scoreView
  }
}
