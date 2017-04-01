/**
 * Component for selecting game modes
 */
class ModeSelectionView {
    /**
     * @param parent - this component's parent DOM element
     * @param buttonFactory helper for creating UI buttons
     */
    constructor(parent, buttonFactory) {
        this._parent = parent
        this._buttonFactory = buttonFactory

        this._aiButton = this._buttonFactory.createButton('Artificial Intelligence', 'Play the computer', 'go »', 'ai-button')
        this._hotseatButton = this._buttonFactory.createButton('Hot Seat', 'Play a friend next to you', 'go »', 'hotseat-button')
        this._onlineButton = this._buttonFactory.createButton('Online', 'Play a friend over the internet', 'go »', 'online-button')
    }

    /**
     * Show this component on its parent DOM element
     */
    render() {
        const row = document.createElement('div')
        row.setAttribute('class', 'row')

        row.appendChild(this._aiButton)
        row.appendChild(this._hotseatButton)
        row.appendChild(this._onlineButton)

        this._parent.appendChild(row)
    }

    /**
     * Destroy this component from its parent DOM element
     */
    destroy() {
        while (this._parent.hasChildNodes()) {
            this._parent.removeChild(this._parent.lastChild)
        }
    }

    /**
     * When a mode is selected, call callback with the corresponding GameMode
     * @param callback
     */
    onModeSelect(callback) {
        this._aiButton.onclick = () => callback(GameModes.AI)
        this._hotseatButton.onclick = () => callback(GameModes.HOTSEAT)
        this._onlineButton.onclick = () => callback(GameModes.ONLINE)
    }
}