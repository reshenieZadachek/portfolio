import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const targetRotation = useRef(new THREE.Quaternion());
  const smoothFactor = 0.1; // Фактор сглаживания движений (0-1)

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      // Устанавливаем начальную ориентацию камеры
      const initialRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, -Math.PI / 2, 0, 'YXZ')
      );
      camera.quaternion.copy(initialRotation);
    }
  }, [isAccelerometerMode, userLocation, camera]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразуем углы в радианы
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Вычисляем звёздное время
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      // Создаём кватернион для ориентации устройства
      const deviceQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ'));

      // Создаём кватернион для коррекции по географическому положению и времени
      const correctionQuaternion = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(-latitudeRad, -siderealTime, 0, 'YXZ'));

      // Комбинируем кватернионы
      targetRotation.current.multiplyQuaternions(correctionQuaternion, deviceQuaternion);

      // Применяем плавный переход к целевой ориентации
      camera.quaternion.slerp(targetRotation.current, smoothFactor);
    }
  });

  return null;
}

// Функция для вычисления звёздного времени
function calculateSiderealTime(longitude, date) {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const julianDays = (date - J2000) / (1000 * 60 * 60 * 24);
  const centuries = julianDays / 36525;

  let siderealTime = 280.46061837 + 360.98564736629 * julianDays + 0.000387933 * centuries * centuries - centuries * centuries * centuries / 38710000;
  siderealTime = siderealTime % 360;

  return THREE.MathUtils.degToRad(siderealTime + longitude);
}

export default CameraController;
