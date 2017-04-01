class GameContainerViewFactory {
  constructor(parent, canvas) {
    this._parent = parent
    this._canvas = canvas
  }

  createBoardContainerView(boardSize) {
    const boardView = new BoardView(boardSize, this._canvas)
    const scoreView = new ScoreView(document.createElement('div'))
    const passButtonView = new PassButtonView(document.createElement('div'), new ButtonFactory())
    return new GameContainerView(this._parent, boardView, scoreView, passButtonView)
  }
}
