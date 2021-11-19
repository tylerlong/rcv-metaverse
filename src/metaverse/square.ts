type MazeLocation = {
  x: number;
  z: number;
};

// a square like Times Square
class Square {
  size: number;
  player: MazeLocation;

  constructor(size: number) {
    if (size % 2 === 0) {
      size += 1; // size must be odd
    }
    this.size = size;
    this.player = {
      x: (size - 1) / 2,
      z: 1,
    };
  }
}

export default Square;
