import React from 'react';
import Star from './Star';
import ConstellationLines from './ConstellationLines';
import { toSpherical } from './Utils';

const constellationRadius = 350;
const starSize = 3;
const starColor = '#FFFFFF';
const lineColor = '#4169E1';

const Constellation = ({ constellation, isHovered, onClick, onHover, onHoverEnd }) => {
  return (
    <group>
      {constellation.stars.map((star, starIdx) => {
        const position = toSpherical(constellationRadius, star.ra, star.dec);
        return (
          <Star
            key={starIdx}
            position={position.toArray()}
            size={starSize}
            color={starColor}
            hovered={isHovered}
            onClick={onClick}
            onPointerOver={onHover}
            onPointerOut={onHoverEnd}
          />
        );
      })}
      <ConstellationLines 
        stars={constellation.stars}
        lines={constellation.lines}
        radius={constellationRadius} 
        color={lineColor}
      />
    </group>
  );
};

export default Constellation;