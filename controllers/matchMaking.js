const app = require('express').Router()
const Rx = require('rxjs')
const Game = require('../models/Game')


/**
 * This is a subscription map of user.id -> Rx.Subject in order to do Http Longpolling.
 * */
const matchSubscriptions = {}
const KEEP_ALIVE_RESPONSE = require('./helpers/keepAliveResponse')

const MATCH_FOUND_RESPONSE = { match: true }
const MATCH_FIND_MAX_TIME = 20000

/**
 * Wait for another player to join the game.
 */
app.get('/find', (req, res, next) => {
  if (matchSubscriptions[req.user.game.id] === undefined) {
    matchSubscriptions[req.user.game.id] = new Rx.Subject()
  }
  matchSubscriptions[req.user.game.id]
    .timeout(MATCH_FIND_MAX_TIME)
    .take(1)
    .subscribe(() => {
      res.json(MATCH_FOUND_RESPONSE)
      delete matchSubscriptions[req.user.id]
    }, error => {
      if (error instanceof Rx.TimeoutError) {
        res.json(KEEP_ALIVE_RESPONSE)
      } else {
        next(error)
      }
    })
})

/**
 * Join a multiplayer game
 */
app.post('/join', (req, res, next) => {
  Game.findById(req.body.gameId, (err, game) => {
    if (err) return next(err)

    game.joinMultiplayerGame(req.user.id)
    game.save(err => {
      if (err) {
        next(err)
      } else {
        req.user.game = game
        req.user.save(err => {
          if (err) {
            next(err)
          } else {
            if (matchSubscriptions[game.id] !== undefined) {
              matchSubscriptions[game.id].next()
            } else {
              next(new Error('Could not join match for game: ' + game.id))
            }
            res.json({})
          }
        })
      }
    })
  })
})

/**
 * Get the available matches
 */
app.get('/list', (req, res) => {
  res.json(Object.keys(matchSubscriptions))
})

module.exports = app