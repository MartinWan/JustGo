class SizeSelectionView {
  constructor(parent, buttonFactory) {
    this._parent = parent
    this._buttonFactory = buttonFactory
    this._size9Button = this._buttonFactory.createButton('9', '', 'go »', 'size-9')
    this._size13Button = this._buttonFactory.createButton('13', '', 'go »', 'size-9')
    this._size19Button = this._buttonFactory.createButton('19', '', 'go »', 'size-9')
  }

  render() {
    const row = document.createElement('div')
    row.setAttribute('class', 'row')

    row.appendChild(this._size9Button)
    row.appendChild(this._size13Button)
    row.appendChild(this._size19Button)

    this._parent.appendChild(row)
  }

  destroy() {
    // TODO-MW this code is duplicated across all Views
    while (this._parent.hasChildNodes()) {
      this._parent.removeChild(this._parent.lastChild)
    }
  }

  onSizeSelect(callback) {
    this._size9Button.onclick = () => callback(9)
    this._size13Button.onclick = () => callback(13)
    this._size19Button.onclick = () => callback(19)
  }
}