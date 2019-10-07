/* eslint no-param-reassign: ["error", { "props": false }] */
/* globals paper TWEEN */
import Tiling from './tiling';

class Durden {
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
  constructor(container, n, m) {
    this.canvas = window.document.createElement('canvas');
    container.appendChild(this.canvas);
    paper.setup(this.canvas);
    paper.view.applyMatrix = false;
    this.tiling = new Tiling(n, m);
    this.bcdeLen = 50;
    const angB = Tiling.MAX_B;
    this.transformTiles(this.bcdeLen, angB, true);
    paper.view.update();
    paper.view.on('frame', () => { TWEEN.update(); });
  }

  /**
   * Returns a randomly shuffled list of all the tiles in the tiling.
   * @return {Array}
   */
  getShuffledTiles() {
    const tiles = this.tiling.getAllTiles();
    let currentIndex = tiles.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      const temporaryValue = tiles[currentIndex];
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
  showTilesRandom(duration) {
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
  showTilesOrdered(duration) {
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
  static showTiles(tiles, duration) {
    tiles.forEach((tile) => {
      tile.path.opacity = 0;
    });

    let shown = 0;
    return new TWEEN.Tween({ last: 0 })
      .to({ last: tiles.length - 1 }, duration)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate((progress) => {
        const last = Math.floor(progress.last);
        for (let i = shown; i <= last; i += 1) {
          tiles[i].path.opacity = 1;
        }
        shown = last;
      })
      .start();
  }

  /**
   * Returns the inner bounding box of the tiling.
   *
   * The inner bounding box should be the maximal rectangle which is, at all points in the
   * transformation, completely covered by tiles.
   *
   * @return {paper.Rectangle}
   */
  getBounds() {
    const corner1 = this.tiling.superTiles[0][0].group.bounds.center;
    const corner2 = this.tiling.superTiles[0][this.tiling.m - 1].group.bounds.center;
    const corner3 = this.tiling.superTiles[this.tiling.n - 1][0].group.bounds.center;
    const corner4 = this.tiling.superTiles[this.tiling.n - 1][this.tiling.m - 1]
      .group.bounds.center;

    const minX = Math.min(corner1.x, corner3.x);
    const maxX = Math.max(corner2.x, corner4.x);
    const minY = Math.min(corner1.y, corner2.y, corner3.y, corner4.y);
    const maxY = Math.max(corner1.y, corner2.y, corner3.y, corner4.y);

    return new paper.Rectangle({
      from: new paper.Point(minX, minY),
      to: new paper.Point(maxX, maxY),
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
  transformTilesAnimated(
    duration,
    angleFrom = Tiling.MIN_B,
    angleTo = Tiling.MAX_B,
    rescale = false
  ) {
    return new TWEEN.Tween({ angle: angleFrom })
      .to({ angle: angleTo }, duration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate((progress) => {
        this.transformTiles(this.bcdeLen, progress.angle, rescale);
      })
      .repeat(Infinity)
      .yoyo(true)
      .start();
  }

  /**
   * Transforms the shape of the tiles and adjusts the view.
   *
   * @param {Number} segmentLen
   *  Length of the segments. Only the E-A segment has a different length.
   * @param {Number} angB
   *  Angle for vertex B (in degrees)
   */
  transformTiles(segmentLen, angB, rescale = false) {
    this.tiling.transform(segmentLen, angB);
    const bounds = this.getBounds();
    if (rescale) {
      if ((paper.view.getViewSize().width > bounds.width)
      || (paper.view.getViewSize().height > bounds.height)) {
        paper.view.setScaling(Math.max(
          paper.view.getViewSize().width / bounds.width,
          paper.view.getViewSize().height / bounds.height
        ));
      } else {
        paper.view.setScaling(Math.max(
          paper.view.getViewSize().width / bounds.width,
          paper.view.getViewSize().height / bounds.height
        ));
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
  setStroke(width, fillColor) {
    this.tiling.getAllTiles().forEach((tile) => {
      tile.setStroke(width, fillColor);
    });
  }

  /**
   * Color the supertiles in the tiling randomly.
   *
   * @param {Array} colors
   *  List of colors (as '#rrggbb' strings).
   */
  colorSuperTilesRandom(colors) {
    this.tiling.getAllSuperTiles().forEach((superTile) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
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
  colorTilesRandom(colors) {
    this.tiling.getAllTiles().forEach((tile) => {
      tile.path.fillColor = colors[Math.floor(Math.random() * colors.length)];
    });
  }

  /**
   * Color the tiles in the tiling cyclically using the colors in order.
   *
   * @param {Array} colors
   *  List of colors (as '#rrggbb' strings).
   */
  colorTilesPeriodic(colors) {
    this.tiling.getAllTiles().forEach((tile, i) => {
      tile.path.fillColor = colors[i % colors.length];
    });
  }

  /**
   * Color the supertiles in the tiling cyclically using the colors in order.
   *
   * @param {Array} colors
   *  List of colors (as '#rrggbb' strings).
   */
  colorSuperTilesPeriodic(colors) {
    this.tiling.getAllTiles().forEach((tile, i) => {
      tile.path.fillColor = colors[Math.floor(i / 4) % colors.length];
    });
  }
}

Durden.Themes = {
  RGB: [
    '#ff9999',
    '#99ff99',
    '#9999ff',
    '#ff99ff',
  ],
  Spring: [
    '#54678C',
    '#9BDAF2',
    '#F2C12E',
    '#F2E1C2',
    '#D95252',
  ],
  Flowers: [
    '#D95B96',
    '#BABF1B',
    '#D9981E',
    '#D9751E',
    '#8C1616',
  ],
  Autumn: [
    '#A62447',
    '#D9326F',
    '#525F43',
    '#6C2A35',
    '#D9936A',
  ],
  Winter: [
    '#0B0340',
    '#263973',
    '#495F8C',
    '#A0CCF2',
    '#514071',
  ],
  Christmas: [
    '#F2293A',
    '#F24464',
    '#678C5D',
    '#730202',
    '#BFBFBD',
  ],
};

module.exports = {
  Durden,
  Themes: Durden.Themes,
  MIN_ANGLE: Tiling.MIN_B,
  MAX_ANGLE: Tiling.MAX_B,
};
