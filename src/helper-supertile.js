/* globals paper */
import SuperTile from './supertile';

/**
 * A SuperTile with markings useful for debugging
 *
 * The supertile has a mark for each of the outer vertexes. The north mark is larger
 */
export default class HelperSuperTile extends SuperTile {
  constructor() {
    super();

    this.markNorth = new paper.Shape.Circle(this.north, 5);
    this.markSouth = new paper.Shape.Circle(this.south, 3);
    this.markEast = new paper.Shape.Circle(this.east, 3);
    this.markWest = new paper.Shape.Circle(this.west, 3);
    this.markNNE = new paper.Shape.Circle(this.nne, 3);
    this.markNEE = new paper.Shape.Circle(this.nee, 3);
    this.markSE = new paper.Shape.Circle(this.west, 3);
    this.markSSW = new paper.Shape.Circle(this.ssw, 3);
    this.markSWW = new paper.Shape.Circle(this.sww, 3);
    this.markNW = new paper.Shape.Circle(this.nw, 3);

    this.markNorth.fillColor = '#ff0000';
    this.markSouth.fillColor = '#ff0000';
    this.markEast.fillColor = '#0000ff';
    this.markWest.fillColor = '#0000ff';
    this.markNNE.fillColor = '#ff0099';
    this.markNEE.fillColor = '#9900ff';
    this.markSE.fillColor = '#ff00ff';
    this.markSSW.fillColor = '#ff0099';
    this.markSWW.fillColor = '#9900ff';
    this.markNW.fillColor = '#ff00ff';
  }

  transform(segmentLen, angB) {
    super.transform(segmentLen, angB);

    this.markNorth.position = this.north;
    this.markSouth.position = this.south;
    this.markEast.position = this.east;
    this.markWest.position = this.west;
    this.markNEE.position = this.nee;
    this.markNNE.position = this.nne;
    this.markSE.position = this.se;
    this.markSSW.position = this.ssw;
    this.markSWW.position = this.sww;
    this.markNW.position = this.nw;
  }
}
