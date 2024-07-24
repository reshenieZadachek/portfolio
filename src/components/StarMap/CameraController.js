import React, { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function CameraController({ isAccelerometerMode, initialRotation }) {
  const { camera } = useThree();
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const initialRotationRef = useRef(new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ'));

  useEffect(() => {
    if (isAccelerometerMode) {
      // Запрашиваем геолокацию пользователя
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting user location:", error),
        { enableHighAccuracy: true }
      );

      // Обработчик ориентации устройства
      const handleOrientation = (event) => {
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
          setDeviceOrientation({
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma
          });
        }
      };

      // Запрашиваем разрешение на использование датчиков устройства
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            } else {
              console.error('Permission to access device orientation was denied');
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      }

      // Обновляем время каждую минуту
      const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);

      return () => {
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
        clearInterval(timeInterval);
      };
    }
  }, [isAccelerometerMode]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразование углов в радианы
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Вычисляем поправку на географическое положение и время
      const siderealTime = calculateSiderealTime(userLocation.longitude, currentTime);
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      // Создаем новую ориентацию камеры
      const cameraRotation = new THREE.Euler(
        Math.PI / 2 - betaRad,
        alphaRad + siderealTime,
        gammaRad,
        'YXZ'
      );

      // Применяем поправку на широту
      cameraRotation.x -= latitudeRad;

      // Применяем новую ориентацию к камере
      camera.setRotationFromEuler(cameraRotation);
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