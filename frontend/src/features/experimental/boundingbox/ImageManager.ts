import BoundingBox from "./BoundingBox";

class ImageManager {
  imageSrc: string;
  boundingBoxes: BoundingBox[];
  constructor() {
    this.imageSrc = "";
    this.boundingBoxes = [];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addBoundingBox(box: BoundingBox, toast: any) {
    if (!this.boundingBoxes.some((b) => b.doesOverlap(box))) {
      // if (
      //   this.isStartingWithinBox(
      //     box.x as unknown as number,
      //     box.y as unknown as number,
      //   )
      // ) {
      //   toast({
      //     title: 'Cannot overlap.',
      //     description: 'You cannot overlap an already created bounding box.',
      //     status: 'error',
      //     duration: 3000,
      //     position: 'bottom-right',
      //     isClosable: true,
      //   });
      // } else {
      this.boundingBoxes.push(new BoundingBox(box));
      // }
    } else {
      toast({
        title: "Cannot overlap.",
        description: "You cannot overlap an already created bounding box.",
        status: "error",
        duration: 3000,
        position: "bottom-right",
        isClosable: true,
      });
    }
  }

  setImageSrc(src: string) {
    this.imageSrc = src;
  }

  removeBoundingBox(index: number) {
    this.boundingBoxes.splice(index, 1);
  }
}

export default ImageManager;
