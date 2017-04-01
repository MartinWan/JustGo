const express = require('express');
const app = express.Router();
const Game = require('../models/Game')
const colors = require('../models/constants/colors')
const gameModes = require('../models/constants/game-modes')
const Move = require('../models/helpers/move')
const convertMode = require('./conversions/convertMode')
const AI = require('../ai/AI')
const Actions = require('../models/helpers/actions')
const Rx = require('rxjs')

/**
 * This is a subscription map of user.id -> Rx.Subject in order to do Http Longpolling.
 */
const GameEventStreams = {}
const GAME_SUBSCRIPTION_MAX_TIME = 20000
const KEEP_ALIVE_RESPONSE = require('./helpers/keepAliveResponse')


/**
 * Subscribe to game update events. (Longpolling)
 *
 * Possible returns are a Move object
 */
app.get('/pull', (req, res, next) => {
  GameEventStreams[req.user.game.id]
    .timeout(GAME_SUBSCRIPTION_MAX_TIME)
    .take(1)
    .subscribe(game => {
      handlePlayerMove(game, req.user, (err, event) => {
        if (err) {
          next(err)
        } else {
          res.json(event)
        }
      })
    }, error => {
      if (error instanceof Rx.TimeoutError) {
        res.json(KEEP_ALIVE_RESPONSE)
      } else {
        next(error)
      }
    })
})

/**
 * Start a game with a mode and size
 */
app.post('/new', (req, res, next) => {
  let size = parseInt(req.body.size)

  let board = new Array(size).fill(new Array(size).fill(colors.EMPTY))
  let game = new Game({
    board: board,
    gameMetadata: {
      gameMode: convertMode(req.body.mode),
      blackUserId: req.user.id
    }
  })

  GameEventStreams[game.id] = new Rx.Subject()

  game.save((err, game) => {
    if (err) return next(err)

    req.user.game = game
    req.user.save(err => {
      if (err) return next(err)

      res.json(new Actions(game.isUsersTurn(req.user.id)))
    })
  })
})

/**
 * Make a move at a given x, y
 *
 * Returns a move object or { invalid: string }
 */
app.post('/move', (req, res, next) => {
  const x = parseInt(req.body.x)
  const y = parseInt(req.body.y)
  if (isNaN(x) || isNaN(y)) {
    return next(new Error('Invalid x, y or color'))
  }
  const userGame = req.user.game
  const move = userGame.makeMove(x, y, userGame.getUserColor(req.user.id))

  if (move instanceof Move) {
    GameEventStreams[userGame.id].next(userGame)
    userGame.save(err => {
      if (err) return next(err)
      res.json(move)
    })
  } else {
    res.json({
      invalid: move
    })
  }
})

/**
 * Pass. Response will contain an error message if the pass is not legal.
 */
app.post('/pass', (req, res, next) => {
  const userGame = req.user.game
  pass(userGame, userGame.getUserColor(req.user.id), (err, response) => {
    if (err) {
      next(err)
    } else {
      GameEventStreams[userGame.id].next(userGame)
      res.json(response)
    }
  })
})

/**
 * Helper function to handle the move event depending on the game mode.
 * @param game the updated game model with the move
 * @param user the user subscribing to the events
 * @param next the response callback with signature (error, response) => void
 */
function handlePlayerMove(game, user, next) {
  if (game.isOver()) {
    next(null, gameOverResponse(game.turnHistory, game.winnerUsername()))
  } else {
    const lastMove = game.getLastMove()

    if (game.gameMetadata.gameMode === gameModes.AI) {
      AI.makeMove(game.board, lastMove, (error, aiMove) => {
        if (error) {
          next(error)
        } else {
          handleAIMove(aiMove, game, user, next)
        }
      })
    } else if (game.gameMetadata.gameMode === gameModes.ONLINE) {
      if (game.isUsersTurn(user.id)) {
        next(null, lastMove)
      } else {
        next(null, KEEP_ALIVE_RESPONSE)
      }
    } else if (game.gameMetadata.gameMode === gameModes.HOTSEAT) {
      next(null, KEEP_ALIVE_RESPONSE)
    } else {
      throw new Error('Unknown game mode found: ' + game.gameMetadata.gameMode)
    }
  }
}

/**
 * Helper function to handle the AI move
 */
function handleAIMove(aiMove, game, user, next) {
  if (aiMove.pass) {
    pass(game, game.getAiColor(user.id), (err, response) => {
      if (err) {
        next(err)
      } else {
        if (game.isOver()) {
          next(null, gameOverResponse(game.turnHistory, game.winnerUsername()))
        } else {
          next(null, KEEP_ALIVE_RESPONSE)
        }
      }
    })
  } else {
    const move = game.makeMove(aiMove.x, aiMove.y, game.getAiColor(user.id))
    game.save(err => next(err, move))
  }
}

/**
 * Helper function for validating the pass move
 */
function pass(game, color, next) {
  const passError = game.pass(color)

  if (!passError) {
    game.save(err => next(err, KEEP_ALIVE_RESPONSE))
  } else {
    next(null, { invalid: passError })
  }
}

/**
 * Format the game over response
 * @param turnHistory
 * @param winnerUsername
 * @returns {{gameOver: boolean, turnHistory: *, winnerUsername: *}}
 */
function gameOverResponse(turnHistory, winnerUsername) {
  return {
    gameOver: true,
    turnHistory: turnHistory,
    winnerUsername: winnerUsername
  }
}

module.exports = app;