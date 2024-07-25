import React from 'react';

const Star = React.memo(({ position, size, color, hovered, onClick, onPointerOver, onPointerOut }) => {
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={hovered ? '#FFFF00' : color} />
    </mesh>
  );
});

export default Star;