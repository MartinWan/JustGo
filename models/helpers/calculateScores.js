const KOMI = 0 // constant used for handicap to the white player
const colors = require('../constants/colors')

/**
 * Calculate scores
 * @param board
 * @returns {Array} Score list with black in the 0th position, white in the 1st position
 */
module.exports = function calculateScores(board) {

  const threshold = 2;
  var blackScore = 0;
  var whiteScore = KOMI ? KOMI : 0;
  var influence = [];
  for (var i = 0; i < board.length; i++) {
    influence[i] = new Array(board.length).fill(0);
  }

  //this is bad because it defines every piece on board as an influence source
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (board[i][j] !== colors.empty) {
        createInfluence(board[i][j], i, j, influence);
      }
    }
  }
  //----------

  //for each in list of influence sources create influence
  //-------

  for (var i = 0; i < influence.length; i++) {
    for (var j = 0; j < influence.length; j++) {
      if (influence[i][j] > threshold) {
        blackScore++;
      } else if (influence[i][j] < -threshold) {
        whiteScore++;
      }
    }
  }
  return [blackScore, whiteScore];
}

function createInfluence(color, i, j, influenceArr) {
  var multiplier = 0;
  if(color === colors.BLACK) multiplier = 1;
  if(color === colors.WHITE) multiplier = -1;

  for (var y = 0; y < influenceArr.length; y++) {
    for (var x = 0; x < influenceArr.length; x++) {
      var dist = Math.sqrt((x-i)*(x-i) + (y-j)*(y-j));
      influenceArr[x][y] += multiplier * influenceFunction(dist, influenceArr.length);
    }
  }
}

/**
 *converts a distance to an influence value
 *a larger distance translates to a smaller influence value
 */
function influenceFunction(dist, boardSize){
  //to be adjusted experimentally
  return 16 / Math.pow(4,dist);
}

