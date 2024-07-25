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
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [manualAdjustment, setManualAdjustment] = useState({ x: 0, y: 0 });
  const lastCalibrationTime = useRef(Date.now());
  const calibrationInterval = 5 * 60 * 1000; // 5 минут

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

      // Проверяем, нужна ли перекалибровка
      if (currentTime - lastCalibrationTime.current > calibrationInterval) {
        calibrateOrientation();
      }

      // Вычисляем текущую ориентацию устройства
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразуем углы ориентации в кватернион, инвертируя горизонтальную ось
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(beta),
          THREE.MathUtils.degToRad(-alpha), // Инвертируем alpha для исправления горизонтальной оси
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

      // Применяем ручную корректировку
      scene.rotation.y += manualAdjustment.y;
      scene.rotation.x += manualAdjustment.x;

      // Если это первый кадр после включения режима, выполняем калибровку
      if (!isCalibrated) {
        calibrateOrientation();
      }
    }
  });

  const calibrateOrientation = () => {
    setIsCalibrating(true);
    // Вычисляем начальную ориентацию на основе показаний компаса
    const initialHeading = THREE.MathUtils.degToRad(compassHeading.current);
    scene.rotation.y += initialHeading;
    setIsCalibrated(true);
    lastCalibrationTime.current = Date.now();
    
    // Имитация процесса калибровки
    setTimeout(() => {
      setIsCalibrating(false);
    }, 3000); // 3 секунды на калибровку
  };

  const handleManualAdjustment = (axis, value) => {
    setManualAdjustment(prev => ({
      ...prev,
      [axis]: prev[axis] + value
    }));
  };

  return (
    <>
      {isCalibrating && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1000
        }}>
          Калибровка...
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        <button onClick={() => handleManualAdjustment('y', 0.1)}>Повернуть вправо</button>
        <button onClick={() => handleManualAdjustment('y', -0.1)}>Повернуть влево</button>
        <button onClick={() => handleManualAdjustment('x', 0.1)}>Повернуть вверх</button>
        <button onClick={() => handleManualAdjustment('x', -0.1)}>Повернуть вниз</button>
        <button onClick={calibrateOrientation}>Перекалибровать</button>
      </div>
    </>
  );
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