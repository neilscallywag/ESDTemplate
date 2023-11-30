import React from 'react';

import ImageManager from '../ImageManager';

import { BoundingBoxCoordinates } from './BoundingBoxCoordinates';

export interface ImageWithBoundingBoxProps {
  imageManager: ImageManager;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  tempBox: BoundingBoxCoordinates | null;
}
