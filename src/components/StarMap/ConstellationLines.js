import React, { useMemo } from 'react';
import { toSpherical } from './Utils';

const ConstellationLines = React.memo(({ stars, lines, radius, color }) => {
  const points = useMemo(() => stars.map(star => toSpherical(radius, star.ra, star.dec)), [stars, radius]);
  
  return (
    <group>
      {lines.map((line, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...points[line[0]].toArray(), ...points[line[1]].toArray()])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} linewidth={2} />
        </line>
      ))}
    </group>
  );
});

export default ConstellationLines;