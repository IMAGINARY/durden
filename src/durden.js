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
   * @param {Number} angle
   *  Starting angle (in Durden.MIN_ANGLE, Durden.MAX_ANGLE range)
   */
  constructor(container, n, m, angle = Durden.MAX_ANGLE) {
    this.canvas = window.document.createElement('canvas');
    container.appendChild(this.canvas);
    paper.setup(this.canvas);
    paper.view.applyMatrix = false;
    this.tiling = new Tiling(n, m);
    this.bcdeLen = 50;
    this.transformTiles(this.bcdeLen, angle, true);
    paper.view.update();
    paper.view.on('frame', () => { TWEEN.update(); });
  }

  /**
   * Returns a randomly shuffled list of all the tiles in the tiling.
   * @return {Array}
   */
  getShuffledTiles() {
    return Durden.shuffle(this.tiling.getAllTiles());
  }

  /**
   * Returns a randomly shuffled list of all the tiles in the tiling.
   * @return {Array}
   */
  getShuffledSuperTiles() {
    return Durden.shuffle(this.tiling.getAllSuperTiles());
  }

  static shuffle(anArray) {
    let currentIndex = anArray.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      const temporaryValue = anArray[currentIndex];
      anArray[currentIndex] = anArray[randomIndex];
      anArray[randomIndex] = temporaryValue;
    }

    return anArray;
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
    return Durden.setTileVisibilityAnimated(this.getShuffledTiles(), true, duration);
  }

  /**
   * Shows supertiles progressively in random order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  showSuperTilesRandom(duration) {
    return Durden.setTileVisibilityAnimated(this.getShuffledSuperTiles(), true, duration);
  }

  /**
   * Shows tiles progressively in random order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  hideTilesRandom(duration) {
    return Durden.setTileVisibilityAnimated(this.getShuffledTiles(), false, duration);
  }

  /**
   * Hides supertiles progressively in random order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  hideSuperTilesRandom(duration) {
    return Durden.setTileVisibilityAnimated(this.getShuffledSuperTiles(), false, duration);
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
    return Durden.setTileVisibilityAnimated(this.tiling.getAllTiles(), true, duration);
  }

  /**
   * Hides tiles progressively in order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  hideTilesOrdered(duration) {
    return Durden.setTileVisibilityAnimated(this.tiling.getAllTiles(), false, duration);
  }

  /**
   * Shows supertiles progressively in order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  showSuperTilesOrdered(duration) {
    return Durden.setTileVisibilityAnimated(this.tiling.getAllSuperTiles(), true, duration);
  }

  /**
   * Hides supertiles progressively in order
   *
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  hideSuperTilesOrdered(duration) {
    return Durden.setTileVisibilityAnimated(this.tiling.getAllSuperTiles(), false, duration);
  }

  /**
   * Set the visibility of all tiles
   *
   * @param {boolean} visibility
   *  True if they should be shown, false if hidden
   */
  setTileVisibility(visibility) {
    this.tiling.getAllTiles().forEach((tile) => {
      tile.path.opacity = visibility ? 1 : 0;
    });
  }

  /**
   * Change the visibility of an (ordered) list of tiles progressively
   *
   * @param {Array} tiles
   *  Ordered list of tiles or supertiles to show
   * @param {boolean} visibility
   *  True if tiles should be made visible
   * @param {Number} duration
   *  Length of the animation in seconds
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  static setTileVisibilityAnimated(tiles, visibility, duration) {
    let shown = 0;
    return new TWEEN.Tween({ last: 0 })
      .to({ last: tiles.length - 1 }, duration)
      .easing(TWEEN.Easing.Cubic.In)
      .onUpdate((progress) => {
        const last = Math.floor(progress.last);
        for (let i = shown; i <= last; i += 1) {
          tiles[i].setVisibility(visibility);
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
   *  Starting angle (in range Durden.MIN_ANGLE, Durden.MAX_ANGLE)
   * @param {Number} angleTo
   *  Ending angle (in range Durden.MIN_ANGLE, Durden.MAX_ANGLE)
   *  Whether to rescale the animation viewport to completely fill the container
   * @param {boolean} rescale
   *  If true the tiling will be stretched to fill the container
   * @return {Tween}
   *  An instance of Tween (check tweenjs docs)
   */
  transformTilesAnimated(
    duration,
    angleFrom = Durden.MIN_ANGLE,
    angleTo = Durden.MAX_ANGLE,
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
   * @param {boolean} rescale
   *  Whether the tiling should be rescaled to fill the container
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

Durden.MAX_ANGLE = Tiling.MAX_B;
Durden.MIN_ANGLE = Tiling.MIN_B;

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
  MIN_ANGLE: Durden.MIN_ANGLE,
  MAX_ANGLE: Durden.MAX_ANGLE,
};
