import React, { useRef, useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarMapController({ isAccelerometerMode, deviceOrientation, userLocation }) {
  const { camera, scene } = useThree();
  const lastUpdateTime = useRef(Date.now());
  const updateInterval = 16; // ~60 fps
  const smoothFactor = 0.05; // Reduced from 0.1 to 0.05 for smoother transitions
  const smoothedOrientation = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const initialOrientation = useRef(null);
  const starsGroup = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const lastAlpha = useRef(0);
  const rotationAxis = useRef(new THREE.Vector3(0, 1, 0));

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

      // Move all stars and constellations to the starsGroup
      scene.children.forEach(child => {
        if (child.type === 'Group' && child !== starsGroup.current) {
          starsGroup.current.add(child);
        }
      });

      initialOrientation.current = null;
      lastAlpha.current = 0;
      
      // Set initial camera position based on user location
      const latitude = THREE.MathUtils.degToRad(90 - userLocation.latitude);
      const longitude = THREE.MathUtils.degToRad(userLocation.longitude);
      camera.position.setFromSpherical(new THREE.Spherical(1, latitude, longitude));
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    } else {
      if (starsGroup.current) {
        // Move all children back to the scene
        while (starsGroup.current.children.length > 0) {
          scene.add(starsGroup.current.children[0]);
        }
        scene.remove(starsGroup.current);
        starsGroup.current = null;
      }
      // Reset camera position and rotation
      camera.position.set(0, 0, 5);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }, [isAccelerometerMode, userLocation, scene, camera]);

  useFrame(() => {
    if (isAccelerometerMode && userLocation) {
      const currentTimeMs = Date.now();
      if (currentTimeMs - lastUpdateTime.current < updateInterval) return;
      lastUpdateTime.current = currentTimeMs;

      if (!initialOrientation.current) {
        initialOrientation.current = { ...deviceOrientation };
      }

      // Calculate relative angles
      let alpha = deviceOrientation.alpha - initialOrientation.current.alpha;
      let beta = deviceOrientation.beta - initialOrientation.current.beta;
      let gamma = deviceOrientation.gamma - initialOrientation.current.gamma;

      // Normalize angles to [-180, 180] range
      alpha = ((alpha % 360) + 360) % 360;
      beta = ((beta % 360) + 360) % 360;
      gamma = ((gamma % 360) + 360) % 360;
      if (alpha > 180) alpha -= 360;
      if (beta > 180) beta -= 360;
      if (gamma > 180) gamma -= 360;

      // Smooth orientation with lower smoothFactor
      smoothedOrientation.current.alpha = THREE.MathUtils.lerp(smoothedOrientation.current.alpha, alpha, smoothFactor);
      smoothedOrientation.current.beta = THREE.MathUtils.lerp(smoothedOrientation.current.beta, beta, smoothFactor);
      smoothedOrientation.current.gamma = THREE.MathUtils.lerp(smoothedOrientation.current.gamma, gamma, smoothFactor);

      // Convert angles to radians
      const alphaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.alpha);
      const betaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.beta);
      const gammaRad = THREE.MathUtils.degToRad(smoothedOrientation.current.gamma);

      // Create a rotation matrix from Euler angles
      const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(betaRad, alphaRad, -gammaRad, 'YXZ')
      );

      // Apply rotation to camera
      camera.quaternion.setFromRotationMatrix(rotationMatrix);

      // Update star positions based on current time and location
      if (starsGroup.current) {
        const siderealTime = calculateSiderealTime(userLocation.longitude, currentTime);
        starsGroup.current.rotation.y = -siderealTime;
      }
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