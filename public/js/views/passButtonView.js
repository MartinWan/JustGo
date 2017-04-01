class PassButtonView {
  constructor(parent, buttonFactory) {
    this._parent = parent
    this._buttonFactory = buttonFactory
    this._button = this._buttonFactory.createButton('Pass', '', 'go »', 'pass-id')
  }

  render() {
    const div = document.createElement('div')
    div.appendChild(this._button)

    this._parent.appendChild(div)
  }

  destroy() {
    while (this._parent.hasChildNodes()) {
      this._parent.removeChild(this._parent.lastChild)
    }
  }

  get parent() {
    return this._parent
  }

  set passClicked(callback) {
    this._button.onclick = callback
  }
}
