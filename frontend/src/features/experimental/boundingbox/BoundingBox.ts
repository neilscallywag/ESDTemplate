class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this.x = coordinates.x;
    this.y = coordinates.y;
    this.width = coordinates.width;
    this.height = coordinates.height;
  }

  // this is literally from my IS111 finals or labtest LOL
  doesOverlap(otherBox: BoundingBox) {
    const rect1 = {
      left: this.x,
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
    };
    const rect2 = {
      left: otherBox.x,
      top: otherBox.y,
      right: otherBox.x + otherBox.width,
      bottom: otherBox.y + otherBox.height,
    };

    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }
}

export default BoundingBox;
