import React, { useEffect, useState, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function AccelerometerControls() {
  const { camera } = useThree();
  const [hasPermission, setHasPermission] = useState(false);

  const requestOrientationPermission = useCallback(() => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            setHasPermission(true);
          }
        })
        .catch(console.error);
    } else {
      setHasPermission(true);
    }
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    let lastX = 0;
    let lastY = 0;
    const sensitivity = 0.01;

    const handleOrientation = (event) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;

      const x = THREE.MathUtils.degToRad(gamma);
      const y = THREE.MathUtils.degToRad(beta);

      camera.rotation.x += (y - lastY) * sensitivity;
      camera.rotation.y += (x - lastX) * sensitivity;

      lastX = x;
      lastY = y;
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [hasPermission, camera]);

  if (!hasPermission) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          pointerEvents: 'auto',
        }}>
          <p>Для использования акселерометра необходимо разрешение.</p>
          <button onClick={requestOrientationPermission} style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Запросить разрешение
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AccelerometerControls;
