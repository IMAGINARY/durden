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
export default class Tile {
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
  constructor(fillColor, flipH = false, flipV = false) {
    this.path = new paper.Path();
    this.path.closed = true;
    this.path.applyMatrix = false;
    this.path.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    this.path.fillColor = fillColor;
    this.path.strokeColor = '#999999';
    this.path.strokeWidth = 1;
    this.path.strokeJoin = 'bevel';

    for (let i = 0; i < 5; i += 1) {
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
  transform(segmentLen, angB) {
    const { segments } = this.path;
    const angC = 360.0 - 2.0 * angB;

    const beta = (180 - angB) / 2;
    const lengtha = 2 * Math.sin(angB / 2 * Math.PI / 180);
    // Law of cosines
    const lengthb = Math.sqrt(
      lengtha * lengtha + 2 * 2 - 2 * lengtha * 2 * Math.cos((angC - beta) * Math.PI / 180)
    );
    // Law of sines: sin((angC - beta))/lengthb = sin(d/2)/lengtha
    const angD = 2 * Math.asin(
      Math.sin((angC - beta) * Math.PI / 180) / lengthb * lengtha
    ) * 180 / Math.PI;

    // If you don't read the next line you're not an accomplice and your soul is still saved. SORRY.
    // const angD = angB * 1.51 - 99.38
    //   + ((1 - Math.cos((angB - 109) * Math.PI / 180)) * 17.5 - 0.5); // UGLY
    const angles = [0, angB, angC, angD];
    let angle = 0;
    [1, 2, 3, 4].forEach((i) => {
      angle += (180 - angles[i - 1]);
      segments[i].point.set(
        segments[i - 1].point.add(new paper.Point({ length: segmentLen, angle }))
      );
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
  setStroke(width, color) {
    this.path.strokeWidth = width;
    this.path.strokeColor = color;
  }

  /**
   * Set the inner color of the tile
   *
   * @param {String} color
   *  Fill color (in #rrggbb format)
   */
  setColor(color) {
    this.path.fillColor = color;
  }

  /**
   * Sets visibility of the tile
   *
   * @param {boolean} visible
   *  True if it should be made visible, false to hide it.
   */
  setVisibility(visible) {
    this.path.opacity = visible ? 1 : 0;
  }

  /**
   * Vertex A
   * @return {paper.Point}
   */
  get vA() {
    return this.path.localToParent(this.path.segments[0].point);
  }

  /**
   * Vertex B
   * @return {paper.Point}
   */
  get vB() {
    return this.path.localToParent(this.path.segments[1].point);
  }

  /**
   * Vertex C
   * @return {paper.Point}
   */
  get vC() {
    return this.path.localToParent(this.path.segments[2].point);
  }

  /**
   * Vertex D
   * @return {paper.Point}
   */
  get vD() {
    return this.path.localToParent(this.path.segments[3].point);
  }

  /**
   * Vertex E
   * @return {paper.Point}
   */
  get vE() {
    return this.path.localToParent(this.path.segments[4].point);
  }

  /**
   * Makes this tile copy the shape of another tile
   *
   * The "shape" includes the position of all vertices and the transformation matrix.
   *
   * @param {Tile} tile
   * @param {boolean} copyMatrix
   *  Whether to copy the transformation matrix
   */
  copyShape(tile, copyMatrix = true) {
    for (let i = 1; i <= 4; i += 1) {
      this.path.segments[i].point.set(tile.path.segments[i].point);
    }
    if (copyMatrix) {
      this.path.setMatrix(tile.path.getMatrix());
    }
  }
}
