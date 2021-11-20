// type MazeLocation = {
//   x: number;
//   z: number;
// };

// a square like Times Square
class Square {
  size: number;

  constructor(size: number) {
    if (size % 2 === 0) {
      size += 1; // size must be odd
    }
    this.size = size;
  }
}

export default Square;
