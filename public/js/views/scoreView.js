const WHITE_SCORE_LABLEL = 'White: '
const BLACK_SCORE_LABEL = 'Black: '

class ScoreView {
  constructor(parent) {
    this._parent = parent
    this._whiteScore = 0
    this._blackScore = 0
  }

  render() {
    const scoreDiv = document.createElement('div')
    scoreDiv.setAttribute('class', 'col-sm-10')

    const scoreHeading = document.createElement('h2')
    scoreHeading.appendChild(document.createTextNode('Game Score'))
    scoreDiv.appendChild(scoreHeading)

    const black = document.createElement('p')
    black.appendChild(document.createTextNode(this._formattedBlackScore))

    const white = document.createElement('p')
    white.appendChild(document.createTextNode(this._formattedWhiteScore))

    scoreDiv.appendChild(black)
    scoreDiv.appendChild(white)

    this._parent.appendChild(scoreDiv)
  }

  get _formattedWhiteScore() {
    return WHITE_SCORE_LABLEL + this._whiteScore.toString()
  }

  get _formattedBlackScore() {
    return BLACK_SCORE_LABEL + this._blackScore.toString()
  }

  destroy() {
    // TODO-MW this code is duplicated across all Views
    while (this._parent.hasChildNodes()) {
      this._parent.removeChild(this._parent.lastChild)
    }
  }

  updateScores(black, white) {
    this._blackScore = black
    this._whiteScore = white
    this.destroy()
    this.render()
  }

  get parent() {
    return this._parent
  }
}