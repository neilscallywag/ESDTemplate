import React from "react";

import ImageManager from "../ImageManager";

export interface BoundingBoxListProps {
  imageManager: ImageManager;
  setImageManager: React.Dispatch<React.SetStateAction<ImageManager>>;
}
