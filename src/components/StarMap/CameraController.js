import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
    const { scene, camera } = useThree();
    const lastUpdateTime = useRef(Date.now());
    const updateInterval = 16; // ~60 fps
    const smoothFactor = 0.05; // Уменьшен для более плавного движения
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibrationOffset, setCalibrationOffset] = useState({ x: 0, y: 0, z: 0 });
    const lastCalibrationTime = useRef(Date.now());
    const calibrationInterval = 5 * 60 * 1000; // 5 минут
    const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
    const lowPassFilter = useRef({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        if (isAccelerometerMode && userLocation) {
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
            camera.lookAt(0, 0, 1);

            return () => {
                window.removeEventListener('deviceorientation', handleOrientation);
            };
        } else {
            // Сброс вращения сцены при выключении акселерометра
            scene.rotation.set(0, 0, 0);
            setIsCalibrated(false);
        }
    }, [isAccelerometerMode, userLocation, scene, camera]);

    const handleOrientation = (event) => {
        // Сглаживание данных ориентации
        smoothedOrientation.current.alpha = smoothedOrientation.current.alpha * (1 - smoothFactor) + event.alpha * smoothFactor;
        smoothedOrientation.current.beta = smoothedOrientation.current.beta * (1 - smoothFactor) + event.beta * smoothFactor;
        smoothedOrientation.current.gamma = smoothedOrientation.current.gamma * (1 - smoothFactor) + event.gamma * smoothFactor;

        // Применение низкочастотного фильтра
        lowPassFilter.current.x = lowPassFilter.current.x * 0.9 + smoothedOrientation.current.beta * 0.1;
        lowPassFilter.current.y = lowPassFilter.current.y * 0.9 + smoothedOrientation.current.alpha * 0.1;
        lowPassFilter.current.z = lowPassFilter.current.z * 0.9 + smoothedOrientation.current.gamma * 0.1;
    };

    useFrame(() => {
        if (isAccelerometerMode && userLocation) {
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime.current < updateInterval) return;
            lastUpdateTime.current = currentTime;

            if (currentTime - lastCalibrationTime.current > calibrationInterval) {
                calibrateOrientation();
            }

            // Преобразование углов ориентации в кватернион
            const q = new THREE.Quaternion().setFromEuler(
                new THREE.Euler(
                    THREE.MathUtils.degToRad(lowPassFilter.current.x + calibrationOffset.x),
                    THREE.MathUtils.degToRad(-(lowPassFilter.current.y + calibrationOffset.y)),
                    THREE.MathUtils.degToRad(-(lowPassFilter.current.z + calibrationOffset.z)),
                    'YXZ'
                )
            );

            // Плавное вращение камеры
            camera.quaternion.slerp(q, smoothFactor);

            // Расчет сидерического времени и вращение сцены
            const siderealTime = calculateSiderealTime(userLocation.longitude, new Date());
            const latitudeRotation = THREE.MathUtils.degToRad(90 - userLocation.latitude);

            scene.rotation.y = -siderealTime;
            scene.rotation.x = latitudeRotation;

            // Убираем ограничения на "полюсах"
            camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -Math.PI / 2, Math.PI / 2);

            if (!isCalibrated) {
                calibrateOrientation();
            }
        }
    });

    const calibrateOrientation = () => {
        setIsCalibrating(true);
        
        // Используем текущие показания датчиков как базовые
        const baseOrientation = {
            x: lowPassFilter.current.x,
            y: lowPassFilter.current.y,
            z: lowPassFilter.current.z
        };

        // Вычисляем отклонение от идеального положения
        const idealOrientation = calculateIdealOrientation(userLocation);
        
        setCalibrationOffset({
            x: idealOrientation.x - baseOrientation.x,
            y: idealOrientation.y - baseOrientation.y,
            z: idealOrientation.z - baseOrientation.z
        });

        setIsCalibrated(true);
        lastCalibrationTime.current = Date.now();
        
        setTimeout(() => {
            setIsCalibrating(false);
        }, 3000);
    };

    const calculateIdealOrientation = (location) => {
        // Вычисляем идеальную ориентацию на основе географического положения
        const latitude = THREE.MathUtils.degToRad(location.latitude);
        const longitude = THREE.MathUtils.degToRad(location.longitude);

        return {
            x: 90 - THREE.MathUtils.radToDeg(latitude), // наклон к горизонту
            y: THREE.MathUtils.radToDeg(longitude),     // поворот вокруг вертикальной оси
            z: 0 // нет поворота вокруг оси наблюдения
        };
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