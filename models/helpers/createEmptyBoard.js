const colors = require('../constants/colors')

/**
 * Creates a two-dimensional square array of length size
 */
module.exports = function(size) {
  return new Array(size).fill(new Array(size).fill(colors.EMPTY))
}