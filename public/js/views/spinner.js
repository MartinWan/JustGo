/**
 * Show a spinner while loading
 */
class Spinner {
  constructor(parent) {
    this._parent = parent
  }

  render() {
    let div = document.createElement('div')
    div.appendChild(document.createTextNode('SPINNER'))

    this._parent.appendChild(div)
  }

  destroy() {
    // TODO-MW this code is duplicated across all Views
    while (this._parent.hasChildNodes()) {
      this._parent.removeChild(this._parent.lastChild)
    }
  }
}