import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
    const { camera } = useThree();
    const lastUpdateTime = useRef(Date.now());
    const updateInterval = 16; // ~60 fps
    const smoothFactor = 0.1;
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const lastCalibrationTime = useRef(Date.now());
    const calibrationInterval = 5 * 60 * 1000; // 5 минут
    const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
    const initialOrientation = useRef(null);
    const compassHeading = useRef(0);

    useEffect(() => {
        if (isAccelerometerMode && userLocation) {
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation, true);
                            window.addEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
                        } else {
                            console.error('Отказано в доступе к ориентации устройства');
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleOrientation, true);
                window.addEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
            }

            // Устанавливаем начальное положение камеры
            camera.position.set(0, 0, 0);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 1);

            return () => {
                window.removeEventListener('deviceorientation', handleOrientation, true);
                window.removeEventListener('deviceorientationabsolute', handleAbsoluteOrientation, true);
            };
        } else {
            // Сброс положения камеры при выключении акселерометра
            camera.position.set(0, 0, 0);
            camera.up.set(0, 1, 0);
            camera.lookAt(0, 0, 1);
            setIsCalibrated(false);
            initialOrientation.current = null;
        }
    }, [isAccelerometerMode, userLocation, camera]);

    const handleOrientation = (event) => {
        if (!initialOrientation.current) {
            initialOrientation.current = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0
            };
        }

        // Вычисляем относительные углы
        let alpha = (event.alpha || 0) - initialOrientation.current.alpha;
        let beta = (event.beta || 0) - initialOrientation.current.beta;
        let gamma = (event.gamma || 0) - initialOrientation.current.gamma;

        // Нормализуем углы
        alpha = (alpha + 360) % 360;
        beta = Math.max(-90, Math.min(90, beta));
        gamma = Math.max(-90, Math.min(90, gamma));

        // Преобразуем углы в радианы
        const alphaRad = THREE.MathUtils.degToRad(alpha);
        const betaRad = THREE.MathUtils.degToRad(beta);
        const gammaRad = THREE.MathUtils.degToRad(gamma);

        // Применяем сглаживание
        smoothedOrientation.current.alpha = smoothedOrientation.current.alpha * (1 - smoothFactor) + alphaRad * smoothFactor;
        smoothedOrientation.current.beta = smoothedOrientation.current.beta * (1 - smoothFactor) + betaRad * smoothFactor;
        smoothedOrientation.current.gamma = smoothedOrientation.current.gamma * (1 - smoothFactor) + gammaRad * smoothFactor;
    };

    const handleAbsoluteOrientation = (event) => {
        if (event.webkitCompassHeading) {
            // Для устройств iOS
            compassHeading.current = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Для устройств Android
            compassHeading.current = 360 - event.alpha;
        }
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

            // Рассчитываем и применяем поворот камеры в зависимости от местоположения и времени
            const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
            const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

            // Учитываем компасное направление
            const compassRotation = THREE.MathUtils.degToRad(compassHeading.current);

            camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -siderealTime - compassRotation);
            camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -latitudeRotation);

            if (!isCalibrated) {
                calibrateOrientation();
            }
        }
    });

    const calibrateOrientation = () => {
        setIsCalibrating(true);
        
        // Сбрасываем начальную ориентацию
        initialOrientation.current = null;

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