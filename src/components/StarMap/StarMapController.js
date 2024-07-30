import { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera, scene } = useThree();
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.1; // Increased for more responsive movement
  const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialOrientation = useRef(null);
  const starsGroup = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const compassHeading = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAccelerometerMode && userLocation) {
      if (!starsGroup.current) {
        starsGroup.current = new THREE.Group();
        scene.add(starsGroup.current);
      }

      scene.children.forEach(child => {
        if (child.type === 'Group' && child !== starsGroup.current) {
          starsGroup.current.add(child);
        }
      });

      initialOrientation.current = null;
      updateCameraPosition(camera, userLocation);
    } else {
      if (starsGroup.current) {
        while (starsGroup.current.children.length > 0) {
          scene.add(starsGroup.current.children[0]);
        }
        scene.remove(starsGroup.current);
        starsGroup.current = null;
      }
      camera.position.set(0, 0, 5);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }, [isAccelerometerMode, userLocation, scene, camera]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation && deviceOrientation) {
      const currentTimeMs = Date.now();
      if (currentTimeMs - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTimeMs;

      if (!initialOrientation.current) {
        initialOrientation.current = { ...deviceOrientation };
      }

      let { alpha, beta, gamma } = deviceOrientation;

      // Normalize angles
      alpha = ((alpha % 360) + 360) % 360;
      beta = Math.max(-90, Math.min(90, beta)); // Clamp beta to [-90, 90]
      gamma = ((gamma % 360) + 360) % 360;

      // Smooth orientation
      smoothedOrientation.current.alpha = THREE.MathUtils.lerp(smoothedOrientation.current.alpha, alpha, smoothFactor);
      smoothedOrientation.current.beta = THREE.MathUtils.lerp(smoothedOrientation.current.beta, beta, smoothFactor);
      smoothedOrientation.current.gamma = THREE.MathUtils.lerp(smoothedOrientation.current.gamma, gamma, smoothFactor);

      compassHeading.current = calculateCompassHeading(smoothedOrientation.current.alpha, smoothedOrientation.current.beta, smoothedOrientation.current.gamma);

      updateCameraRotation(camera, smoothedOrientation.current, compassHeading.current);

      if (starsGroup.current) {
        const siderealTime = calculateSiderealTime(userLocation.longitude, currentTime);
        starsGroup.current.rotation.y = -siderealTime - THREE.MathUtils.degToRad(compassHeading.current);
      }
    }
  });

  return null;
}

function updateCameraPosition(camera, location) {
  const latitude = THREE.MathUtils.degToRad(90 - location.latitude);
  const longitude = THREE.MathUtils.degToRad(location.longitude);
  camera.position.setFromSpherical(new THREE.Spherical(1, latitude, longitude));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function updateCameraRotation(camera, orientation, compassHeading) {
  const alphaRad = THREE.MathUtils.degToRad(orientation.alpha);
  const betaRad = THREE.MathUtils.degToRad(orientation.beta);
  const gammaRad = THREE.MathUtils.degToRad(orientation.gamma);

  const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
    new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ')
  );

  const compassRotation = new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(compassHeading));
  rotationMatrix.multiply(compassRotation);

  camera.quaternion.setFromRotationMatrix(rotationMatrix);
}

function calculateCompassHeading(alpha, beta, gamma) {
  // Convert degrees to radians
  const alphaRad = alpha * (Math.PI / 180);
  const betaRad = beta * (Math.PI / 180);
  const gammaRad = gamma * (Math.PI / 180);

  // Calculate compass heading
  const x = Math.cos(betaRad) * Math.cos(gammaRad);
  const y = Math.sin(alphaRad) * Math.sin(betaRad) * Math.cos(gammaRad) - Math.cos(alphaRad) * Math.sin(gammaRad);
  let compassHeading = Math.atan2(y, x);

  // Convert compass heading to degrees
  compassHeading = compassHeading * (180 / Math.PI);
  
  // Normalize to 0-360
  compassHeading = (compassHeading + 360) % 360;

  return compassHeading;
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