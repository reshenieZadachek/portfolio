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
      // Request user's geolocation
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

      // Device orientation handler
      const handleOrientation = (event) => {
        setDeviceOrientation({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
        });
      };

      // Request permission to use device sensors
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            } else {
              console.error('Permission to access device orientation was denied');
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      // Update time every minute
      const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        clearInterval(timeInterval);
      };
    }
  }, [isAccelerometerMode]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const { alpha, beta, gamma } = deviceOrientation;
      
      // Convert angles to radians
      const alphaRad = THREE.MathUtils.degToRad(alpha);
      const betaRad = THREE.MathUtils.degToRad(beta);
      const gammaRad = THREE.MathUtils.degToRad(gamma);

      // Calculate correction for geographic location and time
      const siderealTime = calculateSiderealTime(userLocation.longitude, currentTime);
      const latitudeRad = THREE.MathUtils.degToRad(userLocation.latitude);

      // Create new camera orientation
      const q = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(0, alphaRad, 0, 'YXZ'))
        .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(betaRad, 0, -gammaRad, 'YXZ')));

      // Apply latitude correction
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-latitudeRad, 0, 0, 'YXZ')));

      // Apply sidereal time correction
      q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -siderealTime, 0, 'YXZ')));

      // Apply the new orientation to the camera
      camera.setRotationFromQuaternion(q);
    }
  });

  return null;
}

// Function to calculate sidereal time
function calculateSiderealTime(longitude, date) {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const julianDays = (date - J2000) / (1000 * 60 * 60 * 24);
  const centuries = julianDays / 36525;
  
  let siderealTime = 280.46061837 + 360.98564736629 * julianDays + 0.000387933 * centuries * centuries - centuries * centuries * centuries / 38710000;
  siderealTime = siderealTime % 360;
  
  return THREE.MathUtils.degToRad(siderealTime + longitude);
}

export default CameraController;