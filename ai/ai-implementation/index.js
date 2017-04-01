"use strict";
var express = require('express');
var util = require('util');

var AIUtils = require('./lib/AIUtils.js');
var APIUtils = require('./lib/APIUtils')

var AIRandom = require("./lib/AIRandom.js");
var AIMaximizeLiberties = require("./lib/AIMaximizeLiberties.js");
var AIAttackEnemy = require("./lib/AIAttackEnemy.js");
var AIFormEyes = require("./lib/AIFormEyes.js");

var INVALID_MOVE_MESSAAGE = 'Invalid Move';


function makeAiMove(ai, board, lastMove, callback) {
    var move = ai.move(board, lastMove);

    if (move) {
        callback(null, move)
    } else {
        callback(INVALID_MOVE_MESSAAGE)
    }
}

function random(board, lastMove, callback) {
  var ai = new AIRandom('random');
  makeAiMove(ai, board, lastMove, callback)
};
function maxLibs(board, lastMove, callback) {
  var ai = new AIMaximizeLiberties('maximizeLiberties');
  makeAiMove(ai, board, lastMove, callback);
};

function attackEnemy(board, lastMove, callback) {
  var ai = new AIAttackEnemy('attackEnemy');
  makeAiMove(ai, board, lastMove, callback);
};

function formEyes(board, lastMove, callback) {
  var ai = new AIFormEyes('formEyes');
  makeAiMove(ai, board, lastMove, callback);
};

const allActions = [random, maxLibs, attackEnemy, formEyes]



exports.makeMove = function(params, callback) {
  if(!APIUtils.isValidBody(params)) {
    return callback("Invalid request format.");
  }
  var last = APIUtils.lastMoveFromRequest(params)
  var board = APIUtils.boardFromRequest(params)

  let randomIndex = Math.floor(Math.random() * (allActions.length - 1))
  let func = allActions[randomIndex]
  func(board, last, callback)
}
