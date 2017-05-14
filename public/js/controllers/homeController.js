const GameModes = {
  HOTSEAT: 'HOTSEAT_MODE',
  AI: 'AI_MODE',
  ONLINE: 'ONLINE_MODE'
}


$(document).ready(createController)

function createController() {
  const view = document.getElementById('view')

  const csrfToken = document.querySelector('meta[name=csrf-token]').content
  const server = new Server(csrfToken)

  const buttonFactory = new ButtonFactory()
  const modeSelectionView = new ModeSelectionView(view, buttonFactory)
  const sizeSelectionView = new SizeSelectionView(view, buttonFactory)
  const canvas = document.createElement('canvas')
  canvas.setAttribute('width', '1000')
  canvas.setAttribute('height', '1000')

  const gameContainerViewFactory = new GameContainerViewFactory(view, canvas)
  const gameControllerFactory = new GameControllerFactory(gameContainerViewFactory, server)

  const spinner = new Spinner(view)
  const availableMatchesViewFactory = new AvailableMatchesViewFactory(view, buttonFactory)

  const matchmakingView = new MatchmakingView(
    view,
    buttonFactory,
    spinner,
    server,
    availableMatchesViewFactory
  )
  const loggedIn = document.getElementById('login-status')

  new HomeController(
    server,
    modeSelectionView,
    sizeSelectionView,
    gameControllerFactory,
    matchmakingView,
    loggedIn
  )
}

/**
 * Controls game mode selection and size selection.
 * Transitions to GameController once mode/size are selected
 */
class HomeController {
  constructor(server,
              modeSelectionView,
              sizeSelectionView,
              gameControllerFactory,
              matchmakingView,
              loggedIn
  ) {
    this._server = server
    this._modeSelectionView = modeSelectionView
    this._sizeSelectionView = sizeSelectionView
    this._gameContainerViewFactory = gameControllerFactory
    this._matchmakingView = matchmakingView
    this._loggedIn = loggedIn

    this._modeSelected = this._modeSelected.bind(this)
    this._sizeSelected = this._sizeSelected.bind(this)
    this.init()
  }

  init() {
    this._modeSelectionView.render()
    this._modeSelectionView.onModeSelect(this._modeSelected)
    this._sizeSelectionView.onSizeSelect(this._sizeSelected)
  }

  _modeSelected(selectedMode) {
    if (this._loggedIn) {
      this._modeSelectionView.destroy()
      this._selectedMode = selectedMode
      this._sizeSelectionView.render()
    } else {
      window.location = '/user/login'
    }
  }

  _sizeSelected(size) {
    this._sizeSelectionView.destroy()
    if (this._selectedMode === GameModes.ONLINE) {
      this._matchmakingView.render()
      this._matchmakingView.onMatch = () => this._gameContainerViewFactory.createController(size)
    } else {
      this._server.newGame(size, this._selectedMode, (err, actions) => {
        this._gameContainerViewFactory.createController(size)
      })
    }
  }
}


