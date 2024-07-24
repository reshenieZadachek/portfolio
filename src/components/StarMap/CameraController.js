import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const initialRotationRef = useRef(new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'));

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразование углов в радианы
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Вычисляем поправку на географическое положение и время
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      // Создаем новую ориентацию камеры
      const q = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(0, alphaRad, 0, 'YXZ'))
        .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(betaRad, 0, -gammaRad, 'YXZ')));

      // Применяем поправку на широту
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-latitudeRad, 0, 0, 'YXZ')));

      // Применяем поправку на звездное время
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -siderealTime, 0, 'YXZ')));

      // Применяем новую ориентацию к камере
      camera.setRotationFromQuaternion(q);
    }
  });

  return null;
}

// Функция для вычисления звездного времени
function calculateSiderealTime(longitude, date) {
    const J2000 = new Date('2000-01-01T12:00:00Z');
    const julianDays = (date - J2000) / (1000 * 60 * 60 * 24);
    const centuries = julianDays / 36525;
    
    let siderealTime = 280.46061837 + 360.98564736629 * julianDays + 0.000387933 * centuries * centuries - centuries * centuries * centuries / 38710000;
    siderealTime = siderealTime % 360;
    
    return THREE.MathUtils.degToRad(siderealTime + longitude);
}

export default CameraController;