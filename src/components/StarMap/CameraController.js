import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const [isCalibrated, setIsCalibrated] = useState(false);
  const initialOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const lastUpdateTime = useRef(Date.now());
  const smoothFactor = 0.1;
  const movementThreshold = 0.5; // градусов

  useEffect(() => {
    if (isAccelerometerMode && userLocation && !isCalibrated) {
      // Калибровка начального положения
      initialOrientation.current = { ...deviceOrientation };
      smoothedOrientation.current = { ...deviceOrientation };
      setIsCalibrated(true);
    }
  }, [isAccelerometerMode, userLocation, deviceOrientation, isCalibrated]);

  const smoothOrientation = (newOrientation) => {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTime.current) / 1000; // в секундах
    lastUpdateTime.current = currentTime;

    const alphaDiff = getShortestRotation(newOrientation.alpha, smoothedOrientation.current.alpha);
    const betaDiff = newOrientation.beta - smoothedOrientation.current.beta;
    const gammaDiff = newOrientation.gamma - smoothedOrientation.current.gamma;

    smoothedOrientation.current = {
      alpha: smoothedOrientation.current.alpha + alphaDiff * smoothFactor * deltaTime,
      beta: smoothedOrientation.current.beta + betaDiff * smoothFactor * deltaTime,
      gamma: smoothedOrientation.current.gamma + gammaDiff * smoothFactor * deltaTime
    };

    return smoothedOrientation.current;
  };

  const getShortestRotation = (angle1, angle2) => {
    let diff = angle1 - angle2;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    return diff;
  };

  useFrame(() => {
    if (isAccelerometerMode && userLocation && isCalibrated) {
      const smoothed = smoothOrientation(deviceOrientation);

      // Проверяем, превышает ли изменение пороговое значение
      if (Math.abs(getShortestRotation(smoothed.alpha, initialOrientation.current.alpha)) > movementThreshold ||
          Math.abs(smoothed.beta - initialOrientation.current.beta) > movementThreshold ||
          Math.abs(smoothed.gamma - initialOrientation.current.gamma) > movementThreshold) {

        const alphaRad = THREE.MathUtils.degToRad(smoothed.alpha - initialOrientation.current.alpha);
        const betaRad = THREE.MathUtils.degToRad(smoothed.beta - initialOrientation.current.beta);
        const gammaRad = THREE.MathUtils.degToRad(smoothed.gamma - initialOrientation.current.gamma);

        const deviceQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ'));

        const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
        const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);
        const correctionQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(latitudeRad - Math.PI/2, siderealTime, 0, 'YXZ'));

        const targetQuaternion = new THREE.Quaternion().multiplyQuaternions(correctionQuaternion, deviceQuaternion).invert();

        camera.quaternion.slerp(targetQuaternion, 0.1);
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