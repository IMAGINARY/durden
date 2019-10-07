(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Durden = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _tiling = _interopRequireDefault(require("./tiling"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Durden =
/*#__PURE__*/
function () {
  /**
   * Constructor
   *
   * @param {HTMLElement} container
   *  The container for the tiling
   * @param {Number} n
   *  Number of supertiles horizontally
   * @param {Number} m
   *  Number of supertiles vertically
   */
  function Durden(container, n, m) {
    _classCallCheck(this, Durden);

    this.canvas = window.document.createElement('canvas');
    container.appendChild(this.canvas);
    paper.setup(this.canvas);
    paper.view.applyMatrix = false;
    this.tiling = new _tiling["default"](n, m);
    this.bcdeLen = 50;
    var angB = _tiling["default"].MAX_B;
    this.transformTiles(this.bcdeLen, angB, true);
    paper.view.update();
    paper.view.on('frame', function () {
      TWEEN.update();
    });
  }
  /**
   * Returns a randomly shuffled list of all the tiles in the tiling.
   * @return {Array}
   */


  _createClass(Durden, [{
    key: "getShuffledTiles",
    value: function getShuffledTiles() {
      var tiles = this.tiling.getAllTiles();
      var currentIndex = tiles.length; // While there remain elements to shuffle...

      while (currentIndex !== 0) {
        // Pick a remaining element...
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1; // And swap it with the current element.

        var temporaryValue = tiles[currentIndex];
        tiles[currentIndex] = tiles[randomIndex];
        tiles[randomIndex] = temporaryValue;
      }

      return tiles;
    }
    /**
     * Shows the tiles progressively in random order
     *
     * @param {Number} duration
     *  Length of the animation in seconds
     * @return {Tween}
     *  An instance of Tween (check tweenjs docs)
     */

  }, {
    key: "showTilesRandom",
    value: function showTilesRandom(duration) {
      return Durden.showTiles(this.getShuffledTiles(), duration);
    }
    /**
     * Shows the tiles progressively in order
     *
     * @param {Number} duration
     *  Length of the animation in seconds
     * @return {Tween}
     *  An instance of Tween (check tweenjs docs)
     */

  }, {
    key: "showTilesOrdered",
    value: function showTilesOrdered(duration) {
      return Durden.showTiles(this.tiling.getAllTiles(), duration);
    }
    /**
     * Show a (ordered) list of tiles progressively
     *
     * @param {Array} tiles
     *  Ordered list of tiles to show
     * @param duration
     *  Length of the animation in seconds
     * @return {Tween}
     *  An instance of Tween (check tweenjs docs)
     */

  }, {
    key: "getBounds",

    /**
     * Returns the inner bounding box of the tiling.
     *
     * The inner bounding box should be the maximal rectangle which is, at all points in the
     * transformation, completely covered by tiles.
     *
     * @return {paper.Rectangle}
     */
    value: function getBounds() {
      var corner1 = this.tiling.superTiles[0][0].group.bounds.center;
      var corner2 = this.tiling.superTiles[0][this.tiling.m - 1].group.bounds.center;
      var corner3 = this.tiling.superTiles[this.tiling.n - 1][0].group.bounds.center;
      var corner4 = this.tiling.superTiles[this.tiling.n - 1][this.tiling.m - 1].group.bounds.center;
      var minX = Math.min(corner1.x, corner3.x);
      var maxX = Math.max(corner2.x, corner4.x);
      var minY = Math.min(corner1.y, corner2.y, corner3.y, corner4.y);
      var maxY = Math.max(corner1.y, corner2.y, corner3.y, corner4.y);
      return new paper.Rectangle({
        from: new paper.Point(minX, minY),
        to: new paper.Point(maxX, maxY)
      });
    }
    /**
     * Animates the transformation of the shape of the tiles while maintaining the tiling.
     *
     * The angles and side length of the tiles are modified within the parameters
     * of a Type 8 pentagonal tiling.
     *
     * @param {Number} duration
     *  Length of the animation
     * @param {Number} angleFrom
     *  Starting angle (in range Tiling.MIN_B, Tiling.MAX_B)
     * @param {Number} angleTo
     *  Ending angle (in range Tiling.MIN_B, Tiling.MAX_B)
     *  Whether to rescale the animation viewport to completely fill the container
     * @param {boolean} rescale
     *  If true the tiling will be stretched to fill the container
     * @return {Tween}
     *  An instance of Tween (check tweenjs docs)
     */

  }, {
    key: "transformTilesAnimated",
    value: function transformTilesAnimated(duration) {
      var _this = this;

      var angleFrom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tiling["default"].MIN_B;
      var angleTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _tiling["default"].MAX_B;
      var rescale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      return new TWEEN.Tween({
        angle: angleFrom
      }).to({
        angle: angleTo
      }, duration).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function (progress) {
        _this.transformTiles(_this.bcdeLen, progress.angle, rescale);
      }).repeat(Infinity).yoyo(true).start();
    }
    /**
     * Transforms the shape of the tiles and adjusts the view.
     *
     * @param {Number} segmentLen
     *  Length of the segments. Only the E-A segment has a different length.
     * @param {Number} angB
     *  Angle for vertex B (in degrees)
     */

  }, {
    key: "transformTiles",
    value: function transformTiles(segmentLen, angB) {
      var rescale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.tiling.transform(segmentLen, angB);
      var bounds = this.getBounds();

      if (rescale) {
        if (paper.view.getViewSize().width > bounds.width || paper.view.getViewSize().height > bounds.height) {
          paper.view.setScaling(Math.max(paper.view.getViewSize().width / bounds.width, paper.view.getViewSize().height / bounds.height));
        } else {
          paper.view.setScaling(Math.max(paper.view.getViewSize().width / bounds.width, paper.view.getViewSize().height / bounds.height));
        }
      }

      paper.view.setCenter(bounds.getCenter());
    }
    /**
     * Set the stroke (contour line) of all the tiles
     *
     * @param {Number} width
     *  Stroke width
     * @param {String} fillColor
     *  Stroke color (in #rrggbb format)
     */

  }, {
    key: "setStroke",
    value: function setStroke(width, fillColor) {
      this.tiling.getAllTiles().forEach(function (tile) {
        tile.setStroke(width, fillColor);
      });
    }
    /**
     * Color the supertiles in the tiling randomly.
     *
     * @param {Array} colors
     *  List of colors (as '#rrggbb' strings).
     */

  }, {
    key: "colorSuperTilesRandom",
    value: function colorSuperTilesRandom(colors) {
      this.tiling.getAllSuperTiles().forEach(function (superTile) {
        var color = colors[Math.floor(Math.random() * colors.length)];
        superTile.tile1.path.fillColor = color;
        superTile.tile2.path.fillColor = color;
        superTile.tile3.path.fillColor = color;
        superTile.tile4.path.fillColor = color;
      });
    }
    /**
     * Color the tiles in the tiling randomly
     *
     * @param {Array} colors
     *  List of colors (as '#rrggbb' strings).
     */

  }, {
    key: "colorTilesRandom",
    value: function colorTilesRandom(colors) {
      this.tiling.getAllTiles().forEach(function (tile) {
        tile.path.fillColor = colors[Math.floor(Math.random() * colors.length)];
      });
    }
    /**
     * Color the tiles in the tiling cyclically using the colors in order.
     *
     * @param {Array} colors
     *  List of colors (as '#rrggbb' strings).
     */

  }, {
    key: "colorTilesPeriodic",
    value: function colorTilesPeriodic(colors) {
      this.tiling.getAllTiles().forEach(function (tile, i) {
        tile.path.fillColor = colors[i % colors.length];
      });
    }
    /**
     * Color the supertiles in the tiling cyclically using the colors in order.
     *
     * @param {Array} colors
     *  List of colors (as '#rrggbb' strings).
     */

  }, {
    key: "colorSuperTilesPeriodic",
    value: function colorSuperTilesPeriodic(colors) {
      this.tiling.getAllTiles().forEach(function (tile, i) {
        tile.path.fillColor = colors[Math.floor(i / 4) % colors.length];
      });
    }
  }], [{
    key: "showTiles",
    value: function showTiles(tiles, duration) {
      tiles.forEach(function (tile) {
        tile.path.opacity = 0;
      });
      var shown = 0;
      return new TWEEN.Tween({
        last: 0
      }).to({
        last: tiles.length - 1
      }, duration).easing(TWEEN.Easing.Cubic.InOut).onUpdate(function (progress) {
        var last = Math.floor(progress.last);

        for (var i = shown; i <= last; i += 1) {
          tiles[i].path.opacity = 1;
        }

        shown = last;
      }).start();
    }
  }]);

  return Durden;
}();

Durden.Themes = {
  RGB: ['#ff9999', '#99ff99', '#9999ff', '#ff99ff'],
  Spring: ['#54678C', '#9BDAF2', '#F2C12E', '#F2E1C2', '#D95252'],
  Flowers: ['#D95B96', '#BABF1B', '#D9981E', '#D9751E', '#8C1616'],
  Autumn: ['#A62447', '#D9326F', '#525F43', '#6C2A35', '#D9936A'],
  Winter: ['#0B0340', '#263973', '#495F8C', '#A0CCF2', '#514071'],
  Christmas: ['#F2293A', '#F24464', '#678C5D', '#730202', '#BFBFBD']
};
module.exports = {
  Durden: Durden,
  Themes: Durden.Themes,
  MIN_ANGLE: _tiling["default"].MIN_B,
  MAX_ANGLE: _tiling["default"].MAX_B
};

},{"./tiling":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tile = _interopRequireDefault(require("./tile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A SuperTile is a group of four adjacent tiles, each of which is flipped
 * in each of the four different ways. SuperTiles can be placed in a grid
 * to create a Tiling.
 *
 * Each of the "outer" vertexes of a SuperTile has a name according to its position:
 * N = North, NNE = North-northeast, NEE=Northeast-east, etc.
 */
var SuperTile =
/*#__PURE__*/
function () {
  function SuperTile() {
    _classCallCheck(this, SuperTile);

    this.tile1 = new _tile["default"]('#ff9999', false, false);
    this.tile2 = new _tile["default"]('#99ff99', true, false);
    this.tile3 = new _tile["default"]('#9999ff', false, true);
    this.tile4 = new _tile["default"]('#ff99ff', true, true);
    this.group = new paper.Group([this.tile1.path, this.tile2.path, this.tile3.path, this.tile4.path]);
    this.group.applyMatrix = false;
  }
  /**
   * Alters the shape of the SuperTile according to the arguments
   *
   * @param {Number} segmentLength
   *  Length of the segments. Only the E-A segment has a different length.
   * @param {Number} angB
   *  Angle for vertex B (in degrees)
   */


  _createClass(SuperTile, [{
    key: "transform",
    value: function transform(segmentLength, angB) {
      this.tile1.transform(segmentLength, angB);
      this.tile2.copyShape(this.tile1, false);
      this.tile3.copyShape(this.tile1, false);
      this.tile4.copyShape(this.tile1, false); // Align segment E-A of tile2 to E-A of tile1

      this.tile2.path.rotate(this.tile1.vE.subtract(this.tile1.vA).getAngle() - this.tile2.vE.subtract(this.tile2.vA).getAngle()); // Move vertex A of tile2 to vertex A of tile1

      this.tile2.path.translate(this.tile1.vA.subtract(this.tile2.vA)); // Align segment D-C of tile3 to E-D of tile1

      this.tile3.path.rotate(this.tile1.vE.subtract(this.tile1.vD).getAngle() - this.tile3.vD.subtract(this.tile3.vC).getAngle()); // Move vertex D of tile3 to vertex E of tile1

      this.tile3.path.translate(this.tile1.vE.subtract(this.tile3.vD)); // Align segment E-A of tile4 to E-A of tile3

      this.tile4.path.rotate(this.tile3.vE.subtract(this.tile3.vA).getAngle() - this.tile4.vE.subtract(this.tile4.vA).getAngle()); // Move vertex A of tile4 to vertex A of tile3

      this.tile4.path.translate(this.tile3.vA.subtract(this.tile4.vA));
    }
    /**
     * North vertex
     * @return {paper.Point}
     */

  }, {
    key: "copyShape",

    /**
     * Makes this tile copy the shape of another supertile.
     *
     * The "shape" is defined by the shape of all the tiles and their transformation matrixes.
     *
     */
    value: function copyShape(superTile) {
      this.tile1.copyShape(superTile.tile1);
      this.tile2.copyShape(superTile.tile2);
      this.tile3.copyShape(superTile.tile3);
      this.tile4.copyShape(superTile.tile4);
    }
  }, {
    key: "north",
    get: function get() {
      return this.group.localToParent(this.tile1.vA);
    }
    /**
     * North-northeast vertex
     * @return {paper.Point}
     */

  }, {
    key: "nne",
    get: function get() {
      return this.group.localToParent(this.tile1.vB);
    }
    /**
     * Northeast-east vertex
     * @return {paper.Point}
     */

  }, {
    key: "nee",
    get: function get() {
      return this.group.localToParent(this.tile1.vC);
    }
    /**
     * South vertex
     * @return {paper.Point}
     */

  }, {
    key: "south",
    get: function get() {
      return this.group.localToParent(this.tile3.vA);
    }
    /**
     * Southeast vertex
     * @return {paper.Point}
     */

  }, {
    key: "se",
    get: function get() {
      return this.group.localToParent(this.tile3.vB);
    }
    /**
     * South-southwest vertex
     * @return {paper.Point}
     */

  }, {
    key: "ssw",
    get: function get() {
      return this.group.localToParent(this.tile4.vB);
    }
    /**
     * Southwest-west vertex
     * @return {paper.Point}
     */

  }, {
    key: "sww",
    get: function get() {
      return this.group.localToParent(this.tile4.vC);
    }
    /**
     * East vertex
     * @return {paper.Point}
     */

  }, {
    key: "east",
    get: function get() {
      return this.group.localToParent(this.tile1.vD);
    }
    /**
     * West vertex
     * @return {paper.Point}
     */

  }, {
    key: "west",
    get: function get() {
      return this.group.localToParent(this.tile2.vC);
    }
    /**
     * Northwest vertex
     * @return {paper.Point}
     */

  }, {
    key: "nw",
    get: function get() {
      return this.group.localToParent(this.tile2.vB);
    }
  }]);

  return SuperTile;
}();

exports["default"] = SuperTile;

},{"./tile":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* globals paper */

/**
 * A single tile
 *
 *           D
 *         /   \
 *      /        \
 *    E            \
 *    |              C
 *   |              |
 *   |              |
 *  |              |
 *  A-------------B
 *
 */
var Tile =
/*#__PURE__*/
function () {
  /**
   * Constructor
   *
   * @param {string} fillColor
   *  Tile color
   * @param {boolean} flipH
   *  If true the tile will be flipped horizontally
   * @param {boolean} flipV
   *  If true the tile will be flipped vertically
   */
  function Tile(fillColor) {
    var flipH = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var flipV = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, Tile);

    this.path = new paper.Path();
    this.path.closed = true;
    this.path.applyMatrix = false;
    this.path.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    this.path.fillColor = fillColor;
    this.path.strokeColor = '#999999';
    this.path.strokeWidth = 1;

    for (var i = 0; i < 5; i += 1) {
      this.path.add(new paper.Point(0, 0));
    }
  }
  /**
   * Alters the shape of the tile according to the arguments
   *
   * @param {Number} segmentLen
   *  Length of the segments. Only the E-A segment has a different length.
   * @param {Number} angB
   *  Angle for vertex B (in degrees)
   */


  _createClass(Tile, [{
    key: "transform",
    value: function transform(segmentLen, angB) {
      var segments = this.path.segments;
      var angC = 360.0 - 2.0 * angB;
      var beta = (180 - angB) / 2;
      var lengtha = 2 * Math.sin(angB / 2 * Math.PI / 180); // Law of cosines

      var lengthb = Math.sqrt(lengtha * lengtha + 2 * 2 - 2 * lengtha * 2 * Math.cos((angC - beta) * Math.PI / 180)); // Law of sines: sin((angC - beta))/lengthb = sin(d/2)/lengtha

      var angD = 2 * Math.asin(Math.sin((angC - beta) * Math.PI / 180) / lengthb * lengtha) * 180 / Math.PI; // If you don't read the next line you're not an accomplice and your soul is still saved. SORRY.
      // const angD = angB * 1.51 - 99.38
      //   + ((1 - Math.cos((angB - 109) * Math.PI / 180)) * 17.5 - 0.5); // UGLY

      var angles = [0, angB, angC, angD];
      var angle = 0;
      [1, 2, 3, 4].forEach(function (i) {
        angle += 180 - angles[i - 1];
        segments[i].point.set(segments[i - 1].point.add(new paper.Point({
          length: segmentLen,
          angle: angle
        })));
      });
    }
    /**
     * Modify the tile's stroke (contour line)
     *
     * @param {Number} width
     *  Stroke width
     * @param {String} color
     *  Stroke color (in #rrggbb format)
     */

  }, {
    key: "setStroke",
    value: function setStroke(width, color) {
      this.path.strokeWidth = width;
      this.path.strokeColor = color;
    }
    /**
     * Set the inner color of the tile
     *
     * @param {String} color
     *  Fill color (in #rrggbb format)
     */

  }, {
    key: "setColor",
    value: function setColor(color) {
      this.path.fillColor = color;
    }
    /**
     * Vertex A
     * @return {paper.Point}
     */

  }, {
    key: "copyShape",

    /**
     * Makes this tile copy the shape of another tile
     *
     * The "shape" includes the position of all vertices and the transformation matrix.
     *
     * @param {Tile} tile
     * @param {boolean} copyMatrix
     *  Whether to copy the transformation matrix
     */
    value: function copyShape(tile) {
      var copyMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      for (var i = 1; i <= 4; i += 1) {
        this.path.segments[i].point.set(tile.path.segments[i].point);
      }

      if (copyMatrix) {
        this.path.setMatrix(tile.path.getMatrix());
      }
    }
  }, {
    key: "vA",
    get: function get() {
      return this.path.localToParent(this.path.segments[0].point);
    }
    /**
     * Vertex B
     * @return {paper.Point}
     */

  }, {
    key: "vB",
    get: function get() {
      return this.path.localToParent(this.path.segments[1].point);
    }
    /**
     * Vertex C
     * @return {paper.Point}
     */

  }, {
    key: "vC",
    get: function get() {
      return this.path.localToParent(this.path.segments[2].point);
    }
    /**
     * Vertex D
     * @return {paper.Point}
     */

  }, {
    key: "vD",
    get: function get() {
      return this.path.localToParent(this.path.segments[3].point);
    }
    /**
     * Vertex E
     * @return {paper.Point}
     */

  }, {
    key: "vE",
    get: function get() {
      return this.path.localToParent(this.path.segments[4].point);
    }
  }]);

  return Tile;
}();

exports["default"] = Tile;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _supertile = _interopRequireDefault(require("./supertile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A pentagonal tiling
 */
var Tiling =
/*#__PURE__*/
function () {
  /**
   * Builds a tiling of n x m SuperTiles
   *
   * @param {Number} n
   * @param {Number} m
   */
  function Tiling(n, m) {
    _classCallCheck(this, Tiling);

    this.n = n;
    this.m = m;
    this.superTiles = Tiling.createMatrix(this.n, this.m); // Create and connect supertiles

    for (var i = 0; i < this.n; i += 1) {
      for (var j = 0; j < this.m; j += 1) {
        this.superTiles[i][j] = new _supertile["default"]();

        if (j % 2 === 1) {
          // Supertiles in odd rows are flipped and rotated
          this.superTiles[i][j].group.scale(1, -1);
        }
      }
    }
  }
  /**
   * Alters the shape of the tiles according to the arguments
   *
   * @param {Number} segmentLen
   *  Length of the segments. Only the E-A segment has a different length.
   * @param {Number} angB
   *  Angle for vertex B (in degrees)
   */


  _createClass(Tiling, [{
    key: "transform",
    value: function transform(segmentLen, angB) {
      var firstTile = this.superTiles[0][0];
      firstTile.transform(segmentLen, angB); // This baseAngle produces an almost rectangular "stacking" of supertiles

      var baseAngle = 180 - firstTile.tile4.vB.subtract(firstTile.tile1.vC).getAngle();
      var flippedAngle = angB + firstTile.tile2.vB.subtract(firstTile.tile2.vA).getAngle();
      this.superTiles[0][0].group.rotation = baseAngle;

      for (var i = 0; i < this.n; i += 1) {
        for (var j = 0; j < this.m; j += 1) {
          if (i === 0 && j === 0) {
            // eslint-disable-next-line no-continue
            continue;
          }

          this.superTiles[i][j].copyShape(firstTile);

          if (j % 2 === 1) {
            // Supertiles in odd rows are rotated
            this.superTiles[i][j].group.rotation = baseAngle + flippedAngle;
          } else {
            this.superTiles[i][j].group.rotation = baseAngle;
          }

          var distances = [];

          if (i > 0) {
            if (j % 2 === 1) {
              distances.push(this.superTiles[i - 1][j].sww.subtract(this.superTiles[i][j].nne));
            } else {
              distances.push(this.superTiles[i - 1][j].nne.subtract(this.superTiles[i][j].sww));
            }
          }

          if (j > 0) {
            distances.push(this.superTiles[i][j - 1].south.subtract(this.superTiles[i][j].west));
          }

          if (distances.length === 1) {
            this.superTiles[i][j].group.translate(distances[0]);
          }

          if (distances.length === 2) {
            this.superTiles[i][j].group.translate(distances[0].add(distances[1]).multiply(0.5));
          }
        }
      }
    }
    /**
     * Returns all the tiles in the tiling
     * @return {[]}
     */

  }, {
    key: "getAllTiles",
    value: function getAllTiles() {
      var tiles = [];
      this.superTiles.forEach(function (row) {
        row.forEach(function (superTile) {
          tiles.push(superTile.tile1);
          tiles.push(superTile.tile2);
          tiles.push(superTile.tile3);
          tiles.push(superTile.tile4);
        });
      });
      return tiles;
    }
  }, {
    key: "getAllSuperTiles",
    value: function getAllSuperTiles() {
      var superTiles = [];
      this.superTiles.forEach(function (row) {
        row.forEach(function (superTile) {
          superTiles.push(superTile);
        });
      });
      return superTiles;
    }
    /**
     * Creates an empty matrix of size n x m
     *
     * @param {Number} n
     * @param {Number} m
     * @return {[]}
     */

  }], [{
    key: "createMatrix",
    value: function createMatrix(n, m) {
      var matrix = [];

      for (var i = 0; i < n; i += 1) {
        var newRow = [];

        for (var j = 0; j < m; j += 1) {
          newRow.push([]);
        }

        matrix.push(newRow);
      }

      return matrix;
    }
  }]);

  return Tiling;
}();

exports["default"] = Tiling;
Tiling.MIN_B = 74;
Tiling.MAX_B = 156;

},{"./supertile":2}]},{},[1])(1)
});
