class AvailableMatchesView {
  constructor(parent, buttonFactory, matches) {
    this._parent = parent
    this._buttonFactory = buttonFactory
    this._matches = matches

    this._onMatchSelect = this._onMatchSelect.bind(this)
  }

  render() {
    const row = document.createElement('div')
    row.setAttribute('class', 'row')

    this._matches.forEach(match => {
      let button = this._buttonFactory.createButton(match, '', 'Join', match)
      button.onclick = () => this._onMatchSelect(match)

      row.appendChild(button)
    })

    this._parent.appendChild(row)
  }

  _onMatchSelect(match) {
    if (this._matchSelected !== undefined) {
      this._matchSelected(match)
    }
  }

  /**
   * Subscribe to match selected event
   * @param callback
   */
  set matchSelected(callback) {
    this._matchSelected = callback
  }
}

class AvailableMatchesViewFactory {
  constructor(parent, buttonFactory) {
    this._parent = parent
    this._buttonFactory = buttonFactory
  }

  createAvailableMatchesView(matches) {
    return new AvailableMatchesView(
      this._parent,
      this._buttonFactory,
      matches
    )
  }
}