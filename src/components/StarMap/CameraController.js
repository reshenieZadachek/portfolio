import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const [isCalibrated, setIsCalibrated] = useState(false);
  const initialOrientation = useRef(new THREE.Quaternion());
  const smoothedOrientation = useRef(new THREE.Quaternion());
  const lastUpdateTime = useRef(Date.now());
  const velocity = useRef(new THREE.Vector3());
  const smoothFactor = 0.02;
  const movementThreshold = 2; // градусов
  const updateInterval = 100; // мс

  useEffect(() => {
    if (isAccelerometerMode && userLocation && !isCalibrated) {
      const initQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(deviceOrientation.beta),
          THREE.MathUtils.degToRad(deviceOrientation.alpha),
          THREE.MathUtils.degToRad(-deviceOrientation.gamma),
          'YXZ'
        )
      );
      initialOrientation.current.copy(initQuat);
      smoothedOrientation.current.copy(initQuat);
      setIsCalibrated(true);
    }
  }, [isAccelerometerMode, userLocation, deviceOrientation, isCalibrated]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation && isCalibrated) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTime;

      const currentQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(deviceOrientation.beta),
          THREE.MathUtils.degToRad(deviceOrientation.alpha),
          THREE.MathUtils.degToRad(-deviceOrientation.gamma),
          'YXZ'
        )
      );

      const diffQuat = new THREE.Quaternion().multiplyQuaternions(currentQuat, initialOrientation.current.invert());
      const angleDiff = 2 * Math.acos(diffQuat.w) * THREE.MathUtils.RAD2DEG;

      if (angleDiff > movementThreshold) {
        smoothedOrientation.current.slerp(currentQuat, smoothFactor);

        const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
        const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);
        const correctionQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(latitudeRad - Math.PI/2, siderealTime, 0, 'YXZ'));

        const targetQuat = new THREE.Quaternion().multiplyQuaternions(correctionQuat, smoothedOrientation.current).invert();

        // Применяем инерцию
        const currentRotation = new THREE.Euler().setFromQuaternion(camera.quaternion);
        const targetRotation = new THREE.Euler().setFromQuaternion(targetQuat);
        
        velocity.current.set(
          (targetRotation.x - currentRotation.x) * 0.1,
          (targetRotation.y - currentRotation.y) * 0.1,
          (targetRotation.z - currentRotation.z) * 0.1
        );

        camera.rotation.x = velocity.current.x;
        camera.rotation.y = velocity.current.y;
        camera.rotation.z = velocity.current.z;

        // Затухание скорости
        velocity.current.multiplyScalar(0.95);
      }
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

export default CameraController;