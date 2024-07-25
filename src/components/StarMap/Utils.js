import * as THREE from 'three';

export const toSpherical = (radius, ra, dec) => {
  const theta = (ra * Math.PI) / 12;
  const phi = ((90 - dec) * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};