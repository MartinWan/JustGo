/***
 * Represents current actions a user can perform.
 * E.g. If it is their turn
 */
module.exports = class {
  constructor(canMove) {
    this.canMove = canMove
  }
}
