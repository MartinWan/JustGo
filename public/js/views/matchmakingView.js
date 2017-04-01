class MatchmakingView {
  constructor(parent,
              buttonFactory,
              spinner,
              server,
              availableMatchesViewFactory
  ) {
    this._parent = parent
    this._buttonFactory = buttonFactory
    this._spinner = spinner
    this._server = server
    this._availableMatchesViewFactory = availableMatchesViewFactory

    this._createMatchButton = this._buttonFactory.createButton(
      'Create New Match', '', 'go »', 'create-new-match'
    )
    this._lookForMatchButton = this._buttonFactory.createButton(
      'Look for a Match', '', 'go »', 'look-for-match'
    )

    this._createMatchButton.onclick = this._onCreateMatchSelected.bind(this)
    this._lookForMatchButton.onclick = this._onLookForMatchSelected.bind(this)
  }

  render() {
    const row = document.createElement('div')
    row.setAttribute('class', 'row')

    row.appendChild(this._createMatchButton)
    row.appendChild(this._lookForMatchButton)

    this._parent.appendChild(row)
  }

  destroy() {
    // TODO-MW this code is duplicated across all Views
    while (this._parent.hasChildNodes()) {
      this._parent.removeChild(this._parent.lastChild)
    }
  }

  _onCreateMatchSelected() {
    this.destroy()
    this._spinner.render()

    this._server.newGame(9, 'ONLINE_MODE', (actions) => { // TODO-MW unhack this size. Use builder class thats injected?
      // TODO-MW once timers are implemented this will not work since it might start the game early? Solution: Start timers after first turn?
      this._server.match((err, match) => {
        this._emitOnMatch()
      })
    })
  }

  _onLookForMatchSelected() {
    this._server.availableMatches((err, matches) => {
      if (err) throw err
      this._showAvailableMatches(matches)
    })
  }

  _showAvailableMatches(matches) {
    this.destroy()
    let availableMatchesView = this._availableMatchesViewFactory
      .createAvailableMatchesView(matches)
    availableMatchesView.matchSelected = (match) => {
      this._server.joinMatch(match, () => {
        this._emitOnMatch()
      })
    }
    availableMatchesView.render()
  }

  _emitOnMatch() {
    if (this._onMatch) {
      this._onMatch()
    }
  }

  set onMatch(callback) {
    this._onMatch = callback
  }
}