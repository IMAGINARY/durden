import SuperTile from './supertile';

/**
 * A pentagonal tiling
 */
export default class Tiling {
  /**
   * Builds a tiling of n x m SuperTiles
   *
   * @param {Number} n
   * @param {Number} m
   */
  constructor(n, m) {
    this.n = n;
    this.m = m;
    this.superTiles = Tiling.createMatrix(this.n, this.m);
    // Create and connect supertiles
    for (let i = 0; i < this.n; i += 1) {
      for (let j = 0; j < this.m; j += 1) {
        this.superTiles[i][j] = new SuperTile();
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
  transform(segmentLen, angB) {
    const firstTile = this.superTiles[0][0];
    firstTile.transform(segmentLen, angB);
    // This baseAngle produces an almost rectangular "stacking" of supertiles
    const baseAngle = 180 - firstTile.tile4.vB.subtract(firstTile.tile1.vC).getAngle();
    const flippedAngle = angB + firstTile.tile2.vB.subtract(firstTile.tile2.vA).getAngle();
    this.superTiles[0][0].group.rotation = baseAngle;

    for (let i = 0; i < this.n; i += 1) {
      for (let j = 0; j < this.m; j += 1) {
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
        const distances = [];
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
  getAllTiles() {
    const tiles = [];
    this.superTiles.forEach((row) => {
      row.forEach((superTile) => {
        tiles.push(superTile.tile1);
        tiles.push(superTile.tile2);
        tiles.push(superTile.tile3);
        tiles.push(superTile.tile4);
      });
    });
    return tiles;
  }

  getAllSuperTiles() {
    const superTiles = [];
    this.superTiles.forEach((row) => {
      row.forEach((superTile) => {
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
  static createMatrix(n, m) {
    const matrix = [];

    for (let i = 0; i < n; i += 1) {
      const newRow = [];
      for (let j = 0; j < m; j += 1) {
        newRow.push([]);
      }
      matrix.push(newRow);
    }

    return matrix;
  }
}

Tiling.MIN_B = 74;
Tiling.MAX_B = 156;
