
const GameModes = require('../../models/constants/game-modes')

/**
 * Convert the mode format the client sends to an enum
 * used in the server model.
 * @param mode
 */
module.exports = function(mode) { // TODO this is useless. Rename validateMode?
  if (mode === GameModes.AI) { // TODO need to put this string in 1 spot
    return GameModes.AI
  } else if(mode === GameModes.HOTSEAT) {
    return GameModes.HOTSEAT
  } else if (mode === GameModes.ONLINE) {
    return GameModes.ONLINE
  } else {
    throw new Error("Unable to convert " + mode)
  }
}

