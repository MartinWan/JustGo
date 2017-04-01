/**
 * Responsible for handling server communication.
 * Encapsulates longpolling for server driven communication to the client.
 */
class Server {
  constructor(csrfToken) {
    this.csrfToken = csrfToken
  }

  /**
   * Sends a request to the server to create a new game
   * Callback is called with (error, actions)
   */
  newGame(size, mode, callback) {
    this._sendRequest('POST', '/game/new', {
      size: size,
      mode: mode
    }, callback)
  }

  /**
   * Sends the requested move to the server
   * callback is given updates
   */
  makeMove(x, y, callback) {
    const payload = { x: x, y: y }
    this._sendRequest('POST', '/game/move', payload, callback)
  }

  /**
   * Send a request to pass to the server
   * @param callback is given updates
   */
  pass(callback) {
    this._sendRequest('POST', '/game/pass', {}, callback)
  }

  /**
   * Calls the given callback with game events.
   * Game events are other player moves, out-of-time, resignation etc.
   * @param callback
   */
  pullUpdates(callback) {
    this._sendRequest('GET', '/game/pull', {}, (err, updates) => {
      if (err) return callback(err)

      if (updates.type !== "KeepAlive") {
        callback(null, updates)
      }
      return this.pullUpdates(callback)
    })
  }

  /**
   * Calls the callback when a match is made
   * @param callback
   */
  match(callback) {
    this._sendRequest('GET', '/match/find', {}, (err, updates) => {
      if (err) return callback(err)

      if (updates.type !== "KeepAlive") {
        callback(null, updates)
      }
      return this.match(callback)
    })
  }

  /**
   * Calls the callback with matches that are available to join
   * @param callback
   */
  availableMatches(callback) {
    this._sendRequest('GET', '/match/list', {} , (err, updates) => {
      if (err) return callback(err)

      callback(null, updates)
    })
  }

  /**
   * Join the multiplayer match
   * @param matchId the match id to join given from Server.availableMatches
   * @param callback
   */
  joinMatch(matchId, callback) {
    this._sendRequest('POST', '/match/join', { gameId: matchId }, (err, updates) => {
      if (err) return callback(err)

      callback(null, updates) // TODO-MW this interface is fruitless since _sendRequest never
      // even calls the callback with errors
    })
  }

  _sendRequest(method, url, payload, callback) {
    let request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        callback(null, JSON.parse(request.responseText))
      }
    }
    request.open(method, url, true)
    request.setRequestHeader('X-CSRF-TOKEN', this.csrfToken)
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(payload))
  }
}