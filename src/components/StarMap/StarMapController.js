import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Quaternion, Euler } from 'three';

const StarMapController = ({ isAccelerometerMode, deviceOrientation, userLocation }) => {
  const cameraRef = useRef();
  const { camera } = useThree();
  
  const targetRotation = useRef(new Euler(0, 0, 0));
  const currentRotation = useRef(new Euler(0, 0, 0));
  
  useEffect(() => {
    if (cameraRef.current) {
      camera.position.set(0, 0, 0);
      cameraRef.current.position.set(0, 0, 1);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);

  useEffect(() => {
    if (isAccelerometerMode && deviceOrientation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Преобразуем углы ориентации устройства в радианы
      const alphaRad = alpha * (Math.PI / 180);
      const betaRad = beta * (Math.PI / 180);
      const gammaRad = gamma * (Math.PI / 180);
      
      // Создаем новую целевую ориентацию
      targetRotation.current.set(betaRad, alphaRad, -gammaRad, 'YXZ');
    }
  }, [isAccelerometerMode, deviceOrientation]);

  useFrame(() => {
    if (isAccelerometerMode && cameraRef.current) {
      // Плавно интерполируем текущую ротацию к целевой
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;
      currentRotation.current.z += (targetRotation.current.z - currentRotation.current.z) * 0.1;
      
      // Применяем ротацию к камере
      cameraRef.current.rotation.copy(currentRotation.current);
    }
  });

  return (
    <group ref={cameraRef}>
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};

export default StarMapController;