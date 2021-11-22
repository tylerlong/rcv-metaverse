// a square like Times Square
class Square {
  numberOfScreens: number;
  width: number;
  height: number;

  constructor(numberOfScreens: number) {
    this.numberOfScreens = numberOfScreens;
    this.width = numberOfScreens * 10;
    this.height = 32;
  }
}

export default Square;
