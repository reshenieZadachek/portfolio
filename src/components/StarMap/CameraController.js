import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
    const { scene, camera } = useThree();
    const lastUpdateTime = useRef(Date.now());
    const updateInterval = 16; // ~60 fps
    const smoothFactor = 0.1; // Увеличено для более быстрого отклика
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const lastCalibrationTime = useRef(Date.now());
    const calibrationInterval = 5 * 60 * 1000; // 5 минут
    const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });

    useEffect(() => {
        if (isAccelerometerMode && userLocation) {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation, true);
                        } else {
                            console.error('Отказано в доступе к ориентации устройства');
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleOrientation, true);
            }

            // Устанавливаем начальное положение камеры
            camera.position.set(0, 0, 0);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 1);

            return () => {
                window.removeEventListener('deviceorientation', handleOrientation, true);
            };
        } else {
            // Сброс вращения сцены при выключении акселерометра
            scene.rotation.set(0, 0, 0);
            setIsCalibrated(false);
        }
    }, [isAccelerometerMode, userLocation, scene, camera]);

    const handleOrientation = (event) => {
        // Преобразуем углы в радианы
        const alpha = THREE.MathUtils.degToRad(event.alpha || 0);
        const beta = THREE.MathUtils.degToRad(event.beta || 0);
        const gamma = THREE.MathUtils.degToRad(event.gamma || 0);

        // Применяем сглаживание
        smoothedOrientation.current.alpha = smoothedOrientation.current.alpha * (1 - smoothFactor) + alpha * smoothFactor;
        smoothedOrientation.current.beta = smoothedOrientation.current.beta * (1 - smoothFactor) + beta * smoothFactor;
        smoothedOrientation.current.gamma = smoothedOrientation.current.gamma * (1 - smoothFactor) + gamma * smoothFactor;
    };

    useFrame(() => {
        if (isAccelerometerMode && userLocation) {
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime.current < updateInterval) return;
            lastUpdateTime.current = currentTime;

            if (currentTime - lastCalibrationTime.current > calibrationInterval) {
                calibrateOrientation();
            }

            // Создаем матрицу вращения на основе данных ориентации устройства
            const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
                new THREE.Euler(
                    smoothedOrientation.current.beta,
                    smoothedOrientation.current.alpha,
                    -smoothedOrientation.current.gamma,
                    'YXZ'
                )
            );

            // Применяем вращение к камере
            camera.quaternion.setFromRotationMatrix(rotationMatrix);

            // Рассчитываем и применяем поворот сцены в зависимости от местоположения и времени
            const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
            const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

            scene.rotation.y = siderealTime;
            scene.rotation.x = latitudeRotation;

            if (!isCalibrated) {
                calibrateOrientation();
            }
        }
    });

    const calibrateOrientation = () => {
        setIsCalibrating(true);
        
        // Здесь можно добавить дополнительную логику калибровки, если необходимо

        setIsCalibrated(true);
        lastCalibrationTime.current = Date.now();
        
        setTimeout(() => {
            setIsCalibrating(false);
        }, 3000);
    };

    return (
        <>
            {isCalibrating && (
                <Html center>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '10px'
                    }}>
                        Калибровка...
                    </div>
                </Html>
            )}
            <Text
                position={[0, 2, -5]}
                color="white"
                fontSize={0.5}
                anchorX="center"
                anchorY="middle"
            >
                {isCalibrated ? 'Калибровка завершена' : 'Требуется калибровка'}
            </Text>
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