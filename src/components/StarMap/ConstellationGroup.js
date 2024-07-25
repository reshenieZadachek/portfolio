import React from 'react';
import Constellation from './Constellation';
import { constellations } from './ConstellationData';

const ConstellationGroup = ({ hoveredConstellation, onConstellationClick, onStarHover }) => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      {constellations.map((constellation, idx) => (
        <Constellation
          key={idx}
          constellation={constellation}
          isHovered={hoveredConstellation === constellation}
          onClick={() => onConstellationClick(constellation)}
          onHover={() => onStarHover(constellation)}
          onHoverEnd={() => onStarHover(null)}
        />
      ))}
    </group>
  );
};

export default ConstellationGroup;