import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { scene, camera } = useThree();
  const initialOrientationRef = useRef(null);
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1; // Коэффициент сглаживания для уменьшения чувствительности

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      // Сбрасываем начальную ориентацию при включении режима акселерометра
      initialOrientationRef.current = null;
      
      // Устанавливаем камеру в начальное положение
      camera.position.set(0, 0, 0);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 1); // Смотрим на северный полюс мира
    } else {
      // Сбрасываем ротацию сцены при выключении режима акселерометра
      scene.rotation.set(0, 0, 0);
    }
  }, [isAccelerometerMode, userLocation, scene, camera]);

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
          THREE.MathUtils.degToRad(deviceOrientation.gamma),
          'YXZ'
        );
      }

      // Вычисляем текущую ориентацию устройства
      const currentOrientation = new THREE.Euler(
        THREE.MathUtils.degToRad(deviceOrientation.beta),
        THREE.MathUtils.degToRad(deviceOrientation.alpha),
        THREE.MathUtils.degToRad(deviceOrientation.gamma),
        'YXZ'
      );

      // Вычисляем разницу между текущей и начальной ориентацией
      const deltaRotation = new THREE.Euler(
        (currentOrientation.x - initialOrientationRef.current.x) * smoothFactor,
        (currentOrientation.y - initialOrientationRef.current.y) * smoothFactor,
        (currentOrientation.z - initialOrientationRef.current.z) * smoothFactor,
        'YXZ'
      );

      // Применяем вращение к камере
      camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -deltaRotation.x);
      camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -deltaRotation.y);
      camera.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -deltaRotation.z);

      // Учитываем географическое положение пользователя и звездное время
      const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
      const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

      // Применяем вращение для учета географического положения
      scene.rotation.y = -siderealTime;
      scene.rotation.x = latitudeRotation;
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