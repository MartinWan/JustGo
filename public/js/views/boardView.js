// enumerations
const COLOR = {
  WHITE: 2,
  BLACK: 1,
  empty: 0
}
const DEFAULT_GRID_MARGIN = 32
const BLACK_FILL_COLOR = 'black'
const WHITE_FILL_COLOR = '#ABAB9A'

/**
 * Represents the board in the game of Go.
 * This class wraps the canvas and emits events on hover or on click of the mouse
 * Gridline coordinates are cartesian with (0, 0) being in the top left corner
 */
class BoardView {
  constructor(boardSize, canvas) {
    this._boardSize = boardSize;
    this._canvas = canvas

    this._gridMargin = DEFAULT_GRID_MARGIN;// the margin between the outer gridline and the board
    this._gridWidth = canvas.width - this._gridMargin * 2; //the width of the grid
    this._gridHeight = canvas.width - this._gridMargin * 2; //the height of the grid

    this._squareSize = this._gridWidth / (boardSize - 1);

    this._boardModel = this._emptyBoardModel(boardSize)

    this._context = canvas.getContext("2d");
    this._gridLineWidth = 2;

    this._canvas.onmousemove = this._handleMouseHover.bind(this)
  }

  /**
   * Returns the parent DOM element
   * @returns {*}
   */
  get parent() {
    return this._canvas
  }

  /**
   * Renders the board.
   */
  render() {
    this.drawEmptyBoard()
    for (var y = 0; y < this._boardModel.length; y++){
      for (var x = 0; x < this._boardModel.length; x++) {
        if (this._boardModel[y][x] !== 0) {
          this.drawPiece(x, y, this._boardModel[y][x]);
        }
      }
    }
  }

  drawEmptyBoard() {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)

    //draw the board background
    this._context.fillRect(0, 0, this._canvas.size, this._canvas.size);

    //draw vertical lines
    this._context.fillStyle = "#000000";
    for (let i = 0; i < this._boardSize; i++){
      let xcoord = this._gridMargin - this._gridLineWidth/2 + this._gridWidth/(this._boardSize-1)*i;
      let ycoord = this._gridMargin;
      this._context.fillRect(xcoord, ycoord, this._gridLineWidth, this._gridHeight);
    }

    //draw horizontal lines
    for (let i = 0; i < this._boardSize; i++){
      let xcoord = this._gridMargin;
      let ycoord = this._gridMargin - this._gridLineWidth/2 + this._gridHeight/(this._boardSize-1)*i;
      this._context.fillRect(xcoord, ycoord, this._gridWidth, this._gridLineWidth);
    }
  }

  clearBoard() {
    this._boardModel = this._emptyBoardModel(this._boardSize)
    this.drawEmptyBoard()
  }

  /**
   * Calls the callback(x, y) when the board is clicked
   * with coordinates of the board grid mark
   * @param callback
   */
  subscribeClick(callback) {
    this._canvas.onclick = event => {
      const intersection = this._getBoardPosition(event)

      if (intersection !== undefined) {
        callback(intersection.x, intersection.y)
      }
    }
  }

  unsubscribeMouse() {
    if (!this._canvas.onclick || !this._canvas.onmousemove) {
      throw new Error('Cannot un-subscribe from mouse events if not subscribed')
    } else {
      this._canvas.onclick = null;
      this._canvas.onmousemove = null;
    }
  }

  /**
   * Draw a single piece onto the board
   */
  drawPiece(x, y, color) {
    this._boardModel[y][x] = color;

    //get the x and y coords of the line drawn
    var xcoord = this._gridMargin - this._gridLineWidth/2 + this._gridWidth/(this._boardSize-1)*x;
    var ycoord = this._gridMargin - this._gridLineWidth/2 + this._gridHeight/(this._boardSize-1)*y;

    //draw the circle based on the size of the board squares and color passed
    this._context.beginPath();
    this._context.arc(xcoord, ycoord, this._pieceRadius, 0, 2 * Math.PI, false);

    //draw either black or white
    if (color == COLOR.BLACK) {
      this._context.fillStyle = BLACK_FILL_COLOR;
    } else if (color == COLOR.WHITE) {
      this._context.fillStyle = WHITE_FILL_COLOR;
    } else {
      throw new Error('Invalid color: ' + color)
    }

    this._context.fill();
  }

  /**
   * Remove pieces from the board with animation
   * @param capturedPieces of the form Array<{x: x, y: y}>
   */
  animateRemove(capturedPieces) {
    var alpha = 1;
    let frame = (function () {
      if (alpha < 0.1) {
        clearInterval(id);
        this._removePieces(capturedPieces)
        this.render();
      } else {
        this.render();
        alpha = alpha - .01;
        //get the x and y coords of the line drawn
        for (var i = 0; i < capturedPieces.length; i++) {
          var xcoord = this._gridMargin - this._gridLineWidth/2 + this._gridWidth/(this._boardSize-1)*capturedPieces[i].x;
          var ycoord = this._gridMargin - this._gridLineWidth/2 + this._gridHeight/(this._boardSize-1)*capturedPieces[i].y;

          this._context.beginPath();
          this._context.arc(xcoord, ycoord, this._pieceRadius, 0, 2 * Math.PI, false);
          this._context.globalAlpha = alpha;
          this._context.fillStyle = "red";
          this._context.fill();
        }
        this._context.globalAlpha = 1;
      }
    }).bind(this);
    var id = setInterval(frame, 10);
  }

  get _pieceRadius() {
    return this._squareSize * 0.25
  }

  _emptyBoardModel(boardSize) {
    let board = new Array(boardSize)
    for (let i = 0; i < boardSize; i++) {
      board[i] = new Array(boardSize).fill(0)
    }
    return board
  }

  _removePieces(pieces) {
    for (var piece of pieces) {
      this._boardModel[piece.y][piece.x] = 0;
    }
    this.render();
  }

  /**
   * Draw a temporary piece for on-hover
   */
  _drawTempPiece(x, y) {
    this.render();

    //get the x and y coords of the line drawn
    var xcoord = this._gridMargin - this._gridLineWidth/2 + this._gridWidth/(this._boardSize-1)*x;
    var ycoord = this._gridMargin - this._gridLineWidth/2 + this._gridHeight/(this._boardSize-1)*y;

    //draw the circle based on the size of the board squares and color passed
    var radius = this._squareSize*.3;

    this._context.beginPath();
    this._context.arc(xcoord, ycoord, radius, 0, 2 * Math.PI, false);
    this._context.globalAlpha = .25;
    this._context.fillStyle = "blue";
    this._context.fill();
    this._context.globalAlpha = 1;
  }

  _handleMouseHover(mouseEvent) {
    const boardPosition = this._getBoardPosition(mouseEvent)
    if (this._boardModel[boardPosition.y][boardPosition.x] == 0) {
      this._drawTempPiece(boardPosition.x, boardPosition.y)
    }
  }

  /**
   * Get the board position x, y from the mouse event
   */
  _getBoardPosition(mouseEvent) {
    const canvasPosition = this._getMousePosition(mouseEvent.clientX, mouseEvent.clientY)
    return this._getGridLine(canvasPosition.x, canvasPosition.y)
  }

  /**
   * Given the x, y with (0, 0) being the top left of the canvas,
   * Return the closest grid line
   */
  _getGridLine(x, y) {
    const closestXGridLine = Math.round(x / this._squareSize);
    const closestYGridLine = Math.round(y / this._squareSize);

    return {
      x: closestXGridLine,
      y: closestYGridLine
    }
  }

  /**
   * Given the absolute position x, y, return x, y where (0, 0) is the top left of the canvas.
   */
  _getMousePosition(x, y) {
    const rect = this._canvas.getBoundingClientRect()
    return {
      x: x - rect.left,
      y: y - rect.top
    }
  }
}
