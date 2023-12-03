import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  CSSReset,
  Input,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";

import BoundingBox from "./BoundingBox";
import ImageManager from "./ImageManager";
import {
  BoundingBoxCoordinates,
  BoundingBoxListProps,
  BoundingBoxProps,
  ImageWithBoundingBoxProps,
} from "./interface";

export default function App() {
  const [imageManager, setImageManager] = useState<ImageManager>(
    new ImageManager(),
  );
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [tempBox, setTempBox] = useState<BoundingBoxCoordinates | null>(null);
  const toast = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageManager = new ImageManager();
      newImageManager.setImageSrc(URL.createObjectURL(file));
      setImageManager(newImageManager);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const boxElement = e.currentTarget.getBoundingClientRect();

    // Calculate relative position as percentage
    const startX = ((e.clientX - boxElement.left) / boxElement.width) * 100;
    const startY = ((e.clientY - boxElement.top) / boxElement.height) * 100;

    setStartPoint({ x: startX, y: startY });
    setTempBox(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startPoint) {
      const boxElement = e.currentTarget.getBoundingClientRect();

      // Calculate relative position as percentage
      const mouseX = ((e.clientX - boxElement.left) / boxElement.width) * 100;
      const mouseY = ((e.clientY - boxElement.top) / boxElement.height) * 100;

      setTempBox({
        x: Math.min(mouseX, startPoint.x),
        y: Math.min(mouseY, startPoint.y),
        width: Math.abs(mouseX - startPoint.x),
        height: Math.abs(mouseY - startPoint.y),
      });
    }
  };

  const handleMouseUp = () => {
    if (tempBox) {
      imageManager.addBoundingBox(new BoundingBox(tempBox), toast);
      const updatedImageManager = new ImageManager();
      Object.assign(updatedImageManager, imageManager);
      setImageManager(updatedImageManager);
    }
    setStartPoint(null);
    setTempBox(null);
  };

  return (
    <ChakraProvider>
      <CSSReset />
      <Center>
        <Box
          maxW={"1200px"}
          id="LOLOL"
          alignContent={"center"}
          border={"3px solid black"}
        >
          {!imageManager.imageSrc && (
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          )}
          {imageManager.imageSrc && (
            <ImageWithBoundingBox
              imageManager={imageManager}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              tempBox={tempBox}
            />
          )}
        </Box>
      </Center>
      <Box>
        <BoundingBoxList
          imageManager={imageManager}
          setImageManager={setImageManager}
        />
      </Box>
    </ChakraProvider>
  );
}

const ImageWithBoundingBox: React.FC<ImageWithBoundingBoxProps> = ({
  imageManager,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  tempBox,
}) => {
  return (
    <Box
      maxW={"1200px"}
      style={{ position: "relative", resize: "both", overflow: "auto" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id="NOWAY"
    >
      <img
        draggable={false}
        src={imageManager.imageSrc}
        alt="Uploaded"
        style={{ maxWidth: "100%" }}
      />
      {imageManager.boundingBoxes.map((box, index) => (
        <BoundingBoxComponent coordinates={box} key={index} />
      ))}
      {tempBox && <BoundingBoxComponent coordinates={tempBox} temp />}
    </Box>
  );
};

const BoundingBoxComponent: React.FC<BoundingBoxProps> = ({
  coordinates,
  temp,
}) => {
  return (
    <Box
      className={temp ? "temp-bounding-box" : "bounding-box"}
      style={{
        position: "absolute",
        top: `${coordinates.y}%`,
        left: `${coordinates.x}%`,
        width: `${coordinates.width}%`,
        height: `${coordinates.height}%`,
        border: temp ? "5px dashed red" : "3px solid green",
      }}
    />
  );
};

const BoundingBoxList: React.FC<BoundingBoxListProps> = ({
  imageManager,
  setImageManager,
}) => {
  const removeBoundingBox = (index: number) => {
    const updatedImageManager = new ImageManager();
    Object.assign(updatedImageManager, imageManager);
    updatedImageManager.removeBoundingBox(index);
    setImageManager(updatedImageManager);
  };

  return (
    <List>
      {imageManager.boundingBoxes.map((box, index) => (
        <ListItem key={index}>
          {`Box ${index + 1}: (${box.x}, ${box.y}, ${box.width}, ${
            box.height
          }) `}
          <Button onClick={() => removeBoundingBox(index)}>Remove</Button>
        </ListItem>
      ))}
    </List>
  );
};
