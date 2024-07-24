import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { scene, camera } = useThree();
  const initialOrientationRef = useRef(null);
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps

  useEffect(() => {
    // Сбрасываем начальную ориентацию при включении/выключении режима акселерометра
    if (isAccelerometerMode && userLocation) {
      initialOrientationRef.current = null;
    }
  }, [isAccelerometerMode, userLocation]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTime;

      // Устанавливаем начальную ориентацию, если она еще не установлена
      if (!initialOrientationRef.current) {
        initialOrientationRef.current = new THREE.Euler(
          THREE.MathUtils.degToRad(deviceOrientation.beta),
          THREE.MathUtils.degToRad(deviceOrientation.alpha),
          THREE.MathUtils.degToRad(-deviceOrientation.gamma),
          'YXZ'
        );

        // Устанавливаем камеру в зенит
        camera.position.set(0, 0, 0);
        camera.lookAt(0, 1, 0);
      }

      // Вычисляем текущую ориентацию устройства
      const currentOrientation = new THREE.Euler(
        THREE.MathUtils.degToRad(deviceOrientation.beta),
        THREE.MathUtils.degToRad(deviceOrientation.alpha),
        THREE.MathUtils.degToRad(-deviceOrientation.gamma),
        'YXZ'
      );

      // Вычисляем разницу между текущей и начальной ориентацией
      const deltaRotation = new THREE.Euler(
        currentOrientation.x - initialOrientationRef.current.x,
        currentOrientation.y - initialOrientationRef.current.y,
        currentOrientation.z - initialOrientationRef.current.z,
        'YXZ'
      );

      // Применяем вращение к сцене
      scene.rotation.x = -deltaRotation.x;
      scene.rotation.y = -deltaRotation.y;
      scene.rotation.z = -deltaRotation.z;

      // Учитываем географическое положение пользователя
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);
      
      // Применяем дополнительное вращение для учета географического положения
      scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), siderealTime);
      scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), latitudeRotation);
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