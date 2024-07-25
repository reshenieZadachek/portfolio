import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import ConstellationGroup from '../components/StarMap/ConstellationGroup';
import StarMapController from '../components/StarMap/StarMapController';
import ControlPanel from '../components/StarMap/ControlPanel';
import InfoPanel from '../components/StarMap/InfoPanel';

function StarMap() {
  const [selectedConstellation, setSelectedConstellation] = useState(null);
  const [hoveredConstellation, setHoveredConstellation] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAccelerometerMode, setIsAccelerometerMode] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [userLocation, setUserLocation] = useState(null);
  const starMapRef = useRef(null);

  const handleConstellationClick = useCallback((constellation) => {
    setSelectedConstellation(constellation);
    setInfoVisible(true);
  }, []);

  const handleStarHover = useCallback((constellation) => {
    setHoveredConstellation(constellation);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      starMapRef.current.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  const toggleAccelerometerMode = useCallback(() => {
    setIsAccelerometerMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (isAccelerometerMode) {
      const handleOrientation = (event) => {
        setDeviceOrientation({
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0
        });
      };

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

      return () => {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      };
    }
  }, [isAccelerometerMode]);

  return (
    <div ref={starMapRef} style={{ position: 'relative', height: '600px', width: '100%' }}>
      <Canvas style={{ background: 'black' }}>
        {!isAccelerometerMode && (
          <OrbitControls 
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
          />
        )}
        <StarMapController 
          isAccelerometerMode={isAccelerometerMode}
          deviceOrientation={deviceOrientation}
          userLocation={userLocation}
        />
        <Stars
          radius={130}
          depth={60}
          count={10000}
          factor={4}
          saturation={0}
          fade
        />
        <ConstellationGroup
          hoveredConstellation={hoveredConstellation}
          onConstellationClick={handleConstellationClick}
          onStarHover={handleStarHover}
        />
      </Canvas>
      
      <ControlPanel 
        isFullScreen={isFullScreen}
        isAccelerometerMode={isAccelerometerMode}
        onToggleFullScreen={toggleFullScreen}
        onToggleAccelerometerMode={toggleAccelerometerMode}
      />

      <InfoPanel
        selectedConstellation={selectedConstellation}
        infoVisible={infoVisible}
      />
    </div>
  );
}

export default StarMap;