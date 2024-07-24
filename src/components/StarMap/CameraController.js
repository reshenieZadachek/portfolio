import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const targetQuaternion = useRef(new THREE.Quaternion());
  const smoothFactor = 0.05; // Уменьшили фактор сглаживания для более плавного движения
  const previousOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const orientationThreshold = 0.1; // Пороговое значение для фильтрации малых изменений

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      camera.rotation.set(0, 0, 0);
      camera.quaternion.setFromEuler(camera.rotation);
    }
  }, [isAccelerometerMode, userLocation, camera]);

  const lowPassFilter = (newValue, oldValue, alpha = 0.2) => {
    return oldValue + alpha * (newValue - oldValue);
  };

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      let { alpha, beta, gamma } = deviceOrientation;
      
      // Применяем фильтр низких частот и пороговую фильтрацию
      alpha = Math.abs(alpha - previousOrientation.current.alpha) > orientationThreshold
        ? lowPassFilter(alpha, previousOrientation.current.alpha)
        : previousOrientation.current.alpha;
      beta = Math.abs(beta - previousOrientation.current.beta) > orientationThreshold
        ? lowPassFilter(beta, previousOrientation.current.beta)
        : previousOrientation.current.beta;
      gamma = Math.abs(gamma - previousOrientation.current.gamma) > orientationThreshold
        ? lowPassFilter(gamma, previousOrientation.current.gamma)
        : previousOrientation.current.gamma;

      previousOrientation.current = { alpha, beta, gamma };

      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      const deviceQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ'));

      const correctionQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(latitudeRad - Math.PI/2, siderealTime, 0, 'YXZ'));

      targetQuaternion.current.multiplyQuaternions(correctionQuaternion, deviceQuaternion);
      targetQuaternion.current.invert();

      camera.quaternion.slerp(targetQuaternion.current, smoothFactor);
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