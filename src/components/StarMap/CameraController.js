import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { scene, camera } = useThree();
  const compassHeading = useRef(0);
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1; // Коэффициент сглаживания для уменьшения чувствительности
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      // Запрашиваем доступ к датчикам устройства
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              console.error('Отказано в доступе к ориентации устройства');
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }

      // Устанавливаем начальное положение камеры
      camera.position.set(0, 0, 0);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 1); // Смотрим на северный полюс мира

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    } else {
      // Сбрасываем ротацию сцены при выключении режима акселерометра
      scene.rotation.set(0, 0, 0);
      setIsCalibrated(false);
    }
  }, [isAccelerometerMode, userLocation, scene, camera]);

  const handleOrientation = (event) => {
    if (event.webkitCompassHeading) {
      // Для устройств iOS
      compassHeading.current = event.webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Для Android устройств
      compassHeading.current = 360 - event.alpha;
    }
  };

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const currentTime = Date.now();
      if (currentTime - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTime;

      // Вычисляем текущую ориентацию устройства
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразуем углы ориентации в кватернион
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(beta),
          THREE.MathUtils.degToRad(alpha),
          THREE.MathUtils.degToRad(-gamma),
          'YXZ'
        )
      );

      // Применяем сглаживание
      camera.quaternion.slerp(q, smoothFactor);

      // Учитываем географическое положение пользователя и звездное время
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

      // Применяем вращение для учета географического положения и звездного времени
      scene.rotation.y = -siderealTime;
      scene.rotation.x = latitudeRotation;

      // Применяем коррекцию на основе показаний компаса
      const compassCorrection = THREE.MathUtils.degToRad(compassHeading.current);
      scene.rotation.y -= compassCorrection;

      // Если это первый кадр после включения режима, выполняем калибровку
      if (!isCalibrated) {
        calibrateOrientation();
        setIsCalibrated(true);
      }
    }
  });

  const calibrateOrientation = () => {
    // Вычисляем начальную ориентацию на основе показаний компаса
    const initialHeading = THREE.MathUtils.degToRad(compassHeading.current);
    scene.rotation.y += initialHeading;
  };

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