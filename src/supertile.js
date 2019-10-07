/* globals paper */
import Tile from './tile';

/**
 * A SuperTile is a group of four adjacent tiles, each of which is flipped
 * in each of the four different ways. SuperTiles can be placed in a grid
 * to create a Tiling.
 *
 * Each of the "outer" vertexes of a SuperTile has a name according to its position:
 * N = North, NNE = North-northeast, NEE=Northeast-east, etc.
 */
export default class SuperTile {
  constructor() {
    this.tile1 = new Tile('#ff9999', false, false);
    this.tile2 = new Tile('#99ff99', true, false);
    this.tile3 = new Tile('#9999ff', false, true);
    this.tile4 = new Tile('#ff99ff', true, true);

    this.group = new paper.Group([
      this.tile1.path,
      this.tile2.path,
      this.tile3.path,
      this.tile4.path,
    ]);
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
  transform(segmentLength, angB) {
    this.tile1.transform(segmentLength, angB);
    this.tile2.copyShape(this.tile1, false);
    this.tile3.copyShape(this.tile1, false);
    this.tile4.copyShape(this.tile1, false);

    // Align segment E-A of tile2 to E-A of tile1
    this.tile2.path.rotate(this.tile1.vE.subtract(this.tile1.vA).getAngle()
      - this.tile2.vE.subtract(this.tile2.vA).getAngle());
    // Move vertex A of tile2 to vertex A of tile1
    this.tile2.path.translate(this.tile1.vA.subtract(this.tile2.vA));

    // Align segment D-C of tile3 to E-D of tile1
    this.tile3.path.rotate(this.tile1.vE.subtract(this.tile1.vD).getAngle()
      - this.tile3.vD.subtract(this.tile3.vC).getAngle());
    // Move vertex D of tile3 to vertex E of tile1
    this.tile3.path.translate(this.tile1.vE.subtract(this.tile3.vD));

    // Align segment E-A of tile4 to E-A of tile3
    this.tile4.path.rotate(this.tile3.vE.subtract(this.tile3.vA).getAngle()
      - this.tile4.vE.subtract(this.tile4.vA).getAngle());
    // Move vertex A of tile4 to vertex A of tile3
    this.tile4.path.translate(this.tile3.vA.subtract(this.tile4.vA));
  }

  /**
   * Sets visibility of the supertile
   *
   * @param {boolean} visible
   *  True if it should be made visible, false to hide it.
   */
  setVisibility(visible) {
    this.tile1.setVisibility(visible);
    this.tile2.setVisibility(visible);
    this.tile3.setVisibility(visible);
    this.tile4.setVisibility(visible);
  }

  /**
   * North vertex
   * @return {paper.Point}
   */
  get north() {
    return this.group.localToParent(this.tile1.vA);
  }

  /**
   * North-northeast vertex
   * @return {paper.Point}
   */
  get nne() {
    return this.group.localToParent(this.tile1.vB);
  }

  /**
   * Northeast-east vertex
   * @return {paper.Point}
   */
  get nee() {
    return this.group.localToParent(this.tile1.vC);
  }

  /**
   * South vertex
   * @return {paper.Point}
   */
  get south() {
    return this.group.localToParent(this.tile3.vA);
  }

  /**
   * Southeast vertex
   * @return {paper.Point}
   */
  get se() {
    return this.group.localToParent(this.tile3.vB);
  }

  /**
   * South-southwest vertex
   * @return {paper.Point}
   */
  get ssw() {
    return this.group.localToParent(this.tile4.vB);
  }

  /**
   * Southwest-west vertex
   * @return {paper.Point}
   */
  get sww() {
    return this.group.localToParent(this.tile4.vC);
  }

  /**
   * East vertex
   * @return {paper.Point}
   */
  get east() {
    return this.group.localToParent(this.tile1.vD);
  }

  /**
   * West vertex
   * @return {paper.Point}
   */
  get west() {
    return this.group.localToParent(this.tile2.vC);
  }

  /**
   * Northwest vertex
   * @return {paper.Point}
   */
  get nw() {
    return this.group.localToParent(this.tile2.vB);
  }

  /**
   * Makes this tile copy the shape of another supertile.
   *
   * The "shape" is defined by the shape of all the tiles and their transformation matrixes.
   *
   */
  copyShape(superTile) {
    this.tile1.copyShape(superTile.tile1);
    this.tile2.copyShape(superTile.tile2);
    this.tile3.copyShape(superTile.tile3);
    this.tile4.copyShape(superTile.tile4);
  }
}
