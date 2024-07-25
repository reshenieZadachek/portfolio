import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1;
  const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialOrientation = useRef(null);

  useEffect(() => {
    if (isAccelerometerMode) {
      initialOrientation.current = null;
    }
  }, [isAccelerometerMode]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTime;

      if (!initialOrientation.current) {
        initialOrientation.current = { ...deviceOrientation };
      }

      // Calculate relative angles
      const alpha = (deviceOrientation.alpha - initialOrientation.current.alpha + 360) % 360;
      const beta = deviceOrientation.beta - initialOrientation.current.beta;
      const gamma = deviceOrientation.gamma - initialOrientation.current.gamma;

      // Smooth orientation
      smoothedOrientation.current.alpha = THREE.MathUtils.lerp(smoothedOrientation.current.alpha, alpha, smoothFactor);
      smoothedOrientation.current.beta = THREE.MathUtils.lerp(smoothedOrientation.current.beta, beta, smoothFactor);
      smoothedOrientation.current.gamma = THREE.MathUtils.lerp(smoothedOrientation.current.gamma, gamma, smoothFactor);

      // Convert angles to radians
      const alphaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.alpha);
      const betaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.beta);
      const gammaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.gamma);

      // Create rotation matrix
      const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ')
      );

      // Apply rotation to camera
      camera.quaternion.setFromRotationMatrix(rotationMatrix);

      // Consider user geographic position
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

      // Apply rotation to consider geographic position
      camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -siderealTime);
      camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -latitudeRotation);

      // Fix rotation axis to avoid unwanted rotation
      const up = new THREE.Vector3(0, 1, 0);
      camera.up.copy(up);
    }
  });

  return null;
}

function calculateSiderealTime(longitude, date) {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const julianDays = (date - J2000) / (1000 * 60 * 60 * 24);
  const centuries = julianDays / 36525;
  let siderealTime = 280.46061837 + 360.98564736629 * julianDays +
                     0.000387933 * centuries * centuries -
                     centuries * centuries * centuries / 38710000;
  siderealTime = siderealTime % 360;
  return THREE.MathUtils.degToRad(siderealTime + longitude);
}

export default StarMapController;
