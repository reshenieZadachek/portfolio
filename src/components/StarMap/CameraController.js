import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const targetRotation = useRef(new THREE.Quaternion());
  const initialRotation = useRef(new THREE.Quaternion());
  const smoothFactor = 0.1; // Smoothing factor for movements (0-1)

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      // Set initial camera orientation
      const initialQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, -Math.PI / 2, 0, 'YXZ')
      );
      initialRotation.current.copy(initialQuat);
      camera.quaternion.copy(initialRotation.current);
    }
  }, [isAccelerometerMode, userLocation, camera]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Convert angles to radians
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Calculate sidereal time
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      // Create quaternion for device orientation
      const deviceQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ'));

      // Create quaternion for correction based on geographical location and time
      const correctionQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(-latitudeRad, -siderealTime, 0, 'YXZ'));

      // Combine quaternions
      targetRotation.current.multiplyQuaternions(correctionQuaternion, deviceQuaternion);

      // Apply initial orientation as base
      targetRotation.current.multiply(initialRotation.current);

      // Apply smooth transition to target orientation
      camera.quaternion.slerp(targetRotation.current, smoothFactor);
    }
  });

  return null;
}

// Function to calculate sidereal time
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

export default CameraController;