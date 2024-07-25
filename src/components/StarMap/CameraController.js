import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera } = useThree();
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1;
  const smoothedOrientation = useRef({ x: 0, y: 0, z: 0 });
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
        initialOrientation.current = {
          alpha: deviceOrientation.alpha,
          beta: deviceOrientation.beta,
          gamma: deviceOrientation.gamma
        };
      }

      // Преобразуем ориентацию устройства в вектор направления
      const direction = new THREE.Vector3(
        Math.cos(THREE.MathUtils.degToRad(deviceOrientation.alpha)) * Math.cos(THREE.MathUtils.degToRad(deviceOrientation.beta)),
        Math.sin(THREE.MathUtils.degToRad(deviceOrientation.beta)),
        Math.sin(THREE.MathUtils.degToRad(deviceOrientation.alpha)) * Math.cos(THREE.MathUtils.degToRad(deviceOrientation.beta))
      );

      // Нормализуем вектор
      direction.normalize();

      // Применяем сглаживание
      smoothedOrientation.current.x = THREE.MathUtils.lerp(smoothedOrientation.current.x, direction.x, smoothFactor);
      smoothedOrientation.current.y = THREE.MathUtils.lerp(smoothedOrientation.current.y, direction.y, smoothFactor);
      smoothedOrientation.current.z = THREE.MathUtils.lerp(smoothedOrientation.current.z, direction.z, smoothFactor);

      // Создаем кватернион из сглаженного направления
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(smoothedOrientation.current.x, smoothedOrientation.current.y, smoothedOrientation.current.z)
      );

      // Применяем вращение к камере
      camera.quaternion.copy(quaternion);

      // Учитываем географическое положение пользователя
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

      camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -siderealTime);
      camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -latitudeRotation);
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